package com.semantictalent.finder.service;

import com.semantictalent.finder.config.ShardConfig;
import com.semantictalent.finder.dto.SearchRequestDto;
import com.semantictalent.finder.dto.SearchResultDto;
import com.semantictalent.finder.dto.ProfileSummaryDto;
import com.semantictalent.finder.entity.Profile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import org.springframework.util.StopWatch;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ShardCoordinatorService {
    
    @Autowired
    private ShardConfig shardConfig;
    
    @Autowired
    private ShardedSearchService shardedSearchService;
    
    @Autowired
    private ShardHealthMonitorService shardHealthMonitor;
    
    // Cache for shard routing decisions
    private final Map<String, String> locationShardCache = new ConcurrentHashMap<>();
    private final Map<String, List<String>> queryShardCache = new ConcurrentHashMap<>();
    
    /**
     * Main entry point for cross-shard search coordination
     */
    public SearchResultDto coordinateSearch(SearchRequestDto request, String userIp) {
        StopWatch stopWatch = new StopWatch("CrossShardSearch");
        
        try {
            stopWatch.start("determineTargetShards");
            List<String> targetShards = determineTargetShards(request);
            stopWatch.stop();
            
            log.info("Coordinating search across {} shards: {} for query: '{}'", 
                    targetShards.size(), targetShards, request.getQuery());
            
            stopWatch.start("executeParallelSearch");
            List<CompletableFuture<SearchResultDto>> searchFutures = targetShards.stream()
                .filter(shardId -> shardHealthMonitor.isShardHealthy(shardId))
                .map(shardId -> executeShardSearch(shardId, request))
                .toList();
            stopWatch.stop();
            
            stopWatch.start("aggregateResults");
            SearchResultDto aggregatedResults = aggregateSearchResults(searchFutures, request);
            stopWatch.stop();
            
            log.info("Cross-shard search completed in {}ms. Found {} results from {} shards",
                    stopWatch.getTotalTimeMillis(), 
                    aggregatedResults.getProfiles().size(),
                    targetShards.size());
            
            return aggregatedResults;
            
        } catch (Exception e) {
            log.error("Error in cross-shard search coordination", e);
            return createEmptyResult(request, "Cross-shard search failed: " + e.getMessage());
        }
    }
    
    /**
     * Determine which shards should be queried based on search criteria
     */
    private List<String> determineTargetShards(SearchRequestDto request) {
        String cacheKey = buildShardCacheKey(request);
        
        // Check cache first
        if (queryShardCache.containsKey(cacheKey)) {
            return queryShardCache.get(cacheKey);
        }
        
        List<String> targetShards = new ArrayList<>();
        
        // Analyze query for geographic hints
        Set<String> geographicHints = extractGeographicHints(request.getQuery());
        
        if (!geographicHints.isEmpty()) {
            // Geographic-targeted search
            targetShards.addAll(resolveGeographicShards(geographicHints));
            log.debug("Geographic search detected. Targeting shards: {} for locations: {}", 
                     targetShards, geographicHints);
        } else {
            // Global search - query all active shards
            targetShards.addAll(shardConfig.getAllActiveShardIds());
            log.debug("Global search detected. Querying all {} shards", targetShards.size());
        }
        
        // Apply shard health filtering
        targetShards = targetShards.stream()
            .filter(shardId -> shardHealthMonitor.isShardHealthy(shardId))
            .collect(Collectors.toList());
        
        // Cache the decision
        queryShardCache.put(cacheKey, targetShards);
        
        return targetShards;
    }
    
    /**
     * Extract geographic locations mentioned in search query
     */
    private Set<String> extractGeographicHints(String query) {
        Set<String> hints = new HashSet<>();
        String queryUpper = query.toUpperCase();
        
        // Major US regions and states
        Map<String, String> geoPatterns = Map.of(
            "NEW YORK", "USA_EAST",
            "CALIFORNIA", "USA_WEST", 
            "SAN FRANCISCO", "USA_WEST",
            "LOS ANGELES", "USA_WEST",
            "TEXAS", "USA_CENTRAL",
            "CHICAGO", "USA_CENTRAL",
            "FLORIDA", "USA_SOUTH",
            "ATLANTA", "USA_SOUTH",
            "SEATTLE", "USA_WEST",
            "BOSTON", "USA_EAST"
        );
        
        geoPatterns.forEach((location, region) -> {
            if (queryUpper.contains(location)) {
                hints.add(region);
            }
        });
        
        return hints;
    }
    
    /**
     * Resolve geographic hints to specific shard IDs
     */
    private List<String> resolveGeographicShards(Set<String> geographicHints) {
        return geographicHints.stream()
            .map(hint -> mapRegionToShard(hint))
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());
    }
    
    private String mapRegionToShard(String region) {
        return switch (region) {
            case "USA_EAST" -> "shard_usa_east";
            case "USA_WEST" -> "shard_usa_west";
            case "USA_CENTRAL" -> "shard_usa_central";
            case "USA_SOUTH" -> "shard_usa_south";
            default -> null;
        };
    }
    
    /**
     * Execute search on a specific shard asynchronously
     */
    @Async("shardSearchTaskExecutor")
    public CompletableFuture<SearchResultDto> executeShardSearch(String shardId, SearchRequestDto request) {
        try {
            long startTime = System.currentTimeMillis();
            
            SearchResultDto result = shardedSearchService.searchInShard(shardId, request);
            result.setShardId(shardId);  // Tag result with shard origin
            
            long executionTime = System.currentTimeMillis() - startTime;
            log.debug("Shard {} search completed in {}ms with {} results", 
                     shardId, executionTime, result.getProfiles().size());
            
            return CompletableFuture.completedFuture(result);
            
        } catch (Exception e) {
            log.warn("Search failed on shard {}: {}", shardId, e.getMessage());
            SearchResultDto emptyResult = createEmptyResult(request, "Shard " + shardId + " unavailable");
            emptyResult.setShardId(shardId);
            return CompletableFuture.completedFuture(emptyResult);
        }
    }
    
    /**
     * Aggregate results from multiple shards and apply global ranking
     */
    private SearchResultDto aggregateSearchResults(List<CompletableFuture<SearchResultDto>> searchFutures, 
                                                  SearchRequestDto request) {
        try {
            // Wait for all shard searches to complete
            List<SearchResultDto> shardResults = searchFutures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList());
            
            // Combine all profiles
            List<ProfileSummaryDto> allProfiles = shardResults.stream()
                .flatMap(result -> result.getProfiles().stream())
                .collect(Collectors.toList());
            
            // Global re-ranking by similarity score
            allProfiles.sort((a, b) -> Double.compare(b.getSimilarityScore(), a.getSimilarityScore()));
            
            // Apply global limit
            int limit = request.getLimit() != null ? request.getLimit() : 50;
            List<ProfileSummaryDto> topResults = allProfiles.stream()
                .limit(limit)
                .collect(Collectors.toList());
            
            // Build aggregated metadata
            long totalExecutionTime = shardResults.stream()
                .mapToLong(SearchResultDto::getExecutionTimeMs)
                .max()
                .orElse(0L);
            
            int totalResultsFound = shardResults.stream()
                .mapToInt(result -> result.getProfiles().size())
                .sum();
            
            // Create final result
            SearchResultDto aggregatedResult = SearchResultDto.builder()
                .profiles(topResults)
                .totalResults(totalResultsFound)
                .executionTimeMs(totalExecutionTime)
                .query(request.getQuery())
                .threshold(request.getThreshold())
                .shardsQueried(shardResults.size())
                .success(true)
                .build();
            
            log.info("Aggregated {} profiles from {} shards (total found: {})", 
                    topResults.size(), shardResults.size(), totalResultsFound);
            
            return aggregatedResult;
            
        } catch (Exception e) {
            log.error("Error aggregating shard results", e);
            return createEmptyResult(request, "Failed to aggregate results: " + e.getMessage());
        }
    }
    
    /**
     * Determine optimal shard for profile storage during import
     */
    public String determineProfileShard(Profile profile) {
        if (!shardConfig.isEnabled()) {
            return "default";
        }
        
        // Primary: Geographic placement
        String geographicShard = shardConfig.resolveShardByLocation(
            profile.getLocationCountry(),
            profile.getRegion(),
            profile.getLocality()
        );
        
        // Secondary: Hash-based load balancing for hot regions
        ShardConfig.ShardDefinition shardDef = shardConfig.getShardDefinition(geographicShard);
        if (shardDef != null && isShardOverloaded(geographicShard)) {
            // Use hash distribution to spread load across multiple shards in the region
            return shardConfig.resolveShardByHash(profile.getId().toString());
        }
        
        return geographicShard;
    }
    
    private boolean isShardOverloaded(String shardId) {
        ShardConfig.ShardDefinition shard = shardConfig.getShardDefinition(shardId);
        if (shard == null) return false;
        
        // Check against configured max records (simplified check)
        return shardHealthMonitor.getShardRecordCount(shardId) > shard.getMaxRecords() * 0.85;
    }
    
    private String buildShardCacheKey(SearchRequestDto request) {
        return String.format("%s_%s_%s", 
                request.getQuery().hashCode(),
                request.getLimit(),
                request.getThreshold());
    }
    
    private SearchResultDto createEmptyResult(SearchRequestDto request, String message) {
        return SearchResultDto.builder()
            .profiles(Collections.emptyList())
            .totalResults(0)
            .executionTimeMs(0L)
            .query(request.getQuery())
            .threshold(request.getThreshold())
            .success(false)
            .errorMessage(message)
            .build();
    }
    
    /**
     * Health check for the coordinator service
     */
    public Map<String, Object> getCoordinatorHealth() {
        Map<String, Object> health = new HashMap<>();
        
        List<String> activeShards = shardConfig.getAllActiveShardIds();
        List<String> healthyShards = activeShards.stream()
            .filter(shardHealthMonitor::isShardHealthy)
            .collect(Collectors.toList());
        
        health.put("shardsConfigured", activeShards.size());
        health.put("shardsHealthy", healthyShards.size());
        health.put("cacheSize", queryShardCache.size());
        health.put("shardingEnabled", shardConfig.isEnabled());
        health.put("strategy", shardConfig.getStrategy());
        
        return health;
    }
}