package com.semantictalent.finder.service;

import com.semantictalent.finder.config.ShardConfig;
import com.semantictalent.finder.dto.SearchRequestDto;
import com.semantictalent.finder.dto.SearchResultDto;
import com.semantictalent.finder.dto.ProfileSummaryDto;
import com.semantictalent.finder.repository.ProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class ShardedSearchService {
    
    @Autowired
    private ShardConfig shardConfig;
    
    @Autowired
    private SemanticSearchService semanticSearchService;
    
    @Autowired
    private ProfileRepository profileRepository;
    
    /**
     * Execute search on a specific shard
     * In production, this would connect to the specific shard database
     */
    public SearchResultDto searchInShard(String shardId, SearchRequestDto request) {
        long startTime = System.currentTimeMillis();
        
        try {
            log.debug("Executing search in shard {}: '{}'", shardId, request.getQuery());
            
            ShardConfig.ShardDefinition shard = shardConfig.getShardDefinition(shardId);
            if (shard == null || !shard.isActive()) {
                log.warn("Shard {} not found or inactive", shardId);
                return createEmptyResult(request, "Shard not available", shardId);
            }
            
            // For now, route to the main semantic search service
            // In production, this would use the shard-specific database connection
            SearchResultDto result = semanticSearchService.searchProfiles(request);
            
            // Tag the result with shard information
            result.setShardId(shardId);
            result.setExecutionTimeMs(System.currentTimeMillis() - startTime);
            
            log.debug("Shard {} search completed: {} results in {}ms", 
                     shardId, result.getProfiles().size(), result.getExecutionTimeMs());
            
            return result;
            
        } catch (Exception e) {
            log.error("Search failed in shard {}: {}", shardId, e.getMessage());
            return createEmptyResult(request, "Search failed: " + e.getMessage(), shardId);
        }
    }
    
    /**
     * Get shard-specific profile count
     * In production, this would query the specific shard database
     */
    public long getShardProfileCount(String shardId) {
        try {
            ShardConfig.ShardDefinition shard = shardConfig.getShardDefinition(shardId);
            if (shard == null) return 0L;
            
            // For now, return simulated counts based on our architecture
            return switch (shardId) {
                case "shard_usa_east" -> 15_234_567L;
                case "shard_usa_west" -> 15_112_890L; 
                case "shard_usa_central" -> 12_890_123L;
                case "shard_usa_south" -> 6_234_567L;
                case "shard_international" -> 1_880_472L;
                default -> 0L;
            };
            
            // In production, this would be:
            // return shardSpecificRepository.count();
            
        } catch (Exception e) {
            log.error("Failed to get profile count for shard {}: {}", shardId, e.getMessage());
            return 0L;
        }
    }
    
    /**
     * Check shard connectivity and health
     */
    public boolean isShardConnected(String shardId) {
        try {
            ShardConfig.ShardDefinition shard = shardConfig.getShardDefinition(shardId);
            if (shard == null || !shard.isActive()) {
                return false;
            }
            
            // For now, simulate connectivity check
            // In production, this would attempt to connect to the shard database
            return true;
            
        } catch (Exception e) {
            log.error("Shard connectivity check failed for {}: {}", shardId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Get database-specific statistics for a shard
     */
    public ShardStatistics getShardStatistics(String shardId) {
        try {
            ShardConfig.ShardDefinition shard = shardConfig.getShardDefinition(shardId);
            if (shard == null) {
                return new ShardStatistics(shardId, 0L, 0L, 0.0, false);
            }
            
            long profileCount = getShardProfileCount(shardId);
            long industryCount = Math.round(profileCount * 0.3); // Estimated industries
            double storageGb = profileCount * 0.5 / 1_000_000; // Estimated storage
            boolean healthy = isShardConnected(shardId);
            
            return new ShardStatistics(shardId, profileCount, industryCount, storageGb, healthy);
            
        } catch (Exception e) {
            log.error("Failed to get statistics for shard {}: {}", shardId, e.getMessage());
            return new ShardStatistics(shardId, 0L, 0L, 0.0, false);
        }
    }
    
    private SearchResultDto createEmptyResult(SearchRequestDto request, String message, String shardId) {
        return SearchResultDto.builder()
            .profiles(Collections.emptyList())
            .totalResults(0)
            .executionTimeMs(0L)
            .query(request.getQuery())
            .threshold(request.getThreshold())
            .shardId(shardId)
            .success(false)
            .errorMessage(message)
            .build();
    }
    
    /**
     * Shard statistics data class
     */
    public static class ShardStatistics {
        private final String shardId;
        private final long profileCount;
        private final long industryCount;
        private final double storageSizeGb;
        private final boolean healthy;
        
        public ShardStatistics(String shardId, long profileCount, long industryCount, 
                              double storageSizeGb, boolean healthy) {
            this.shardId = shardId;
            this.profileCount = profileCount;
            this.industryCount = industryCount;
            this.storageSizeGb = storageSizeGb;
            this.healthy = healthy;
        }
        
        // Getters
        public String getShardId() { return shardId; }
        public long getProfileCount() { return profileCount; }
        public long getIndustryCount() { return industryCount; }
        public double getStorageSizeGb() { return storageSizeGb; }
        public boolean isHealthy() { return healthy; }
    }
}