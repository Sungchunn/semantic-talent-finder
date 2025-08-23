package com.semantictalent.finder.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "app.sharding")
@Data
public class ShardConfig {
    
    private boolean enabled = true;
    private String strategy = "geographic_hash"; // geographic_hash, hash_only, geographic_only
    private int defaultShardCount = 5;
    private int maxRecordsPerShard = 15_000_000;
    
    // Shard definitions
    private List<ShardDefinition> shards;
    
    // Geographic mapping
    private Map<String, String> stateToRegion;
    private Map<String, String> countryToShard;
    
    @Data
    public static class ShardDefinition {
        private String shardId;
        private String name;
        private String description;
        private DatabaseConfig database;
        private GeographicConfig geographic;
        private HashConfig hash;
        private boolean active = true;
        private int priority = 1; // Lower numbers = higher priority for reads
        private long maxRecords;
        private double maxStorageGb;
    }
    
    @Data
    public static class DatabaseConfig {
        private String url;
        private String username;
        private String password;
        private String schema;
        private int maxConnections = 50;
        private int minIdleConnections = 5;
        private long connectionTimeoutMs = 30000;
    }
    
    @Data
    public static class GeographicConfig {
        private List<String> regions;
        private List<String> states;
        private List<String> countries;
        private List<String> metros;
        private boolean isPrimary = true;
    }
    
    @Data
    public static class HashConfig {
        private String algorithm = "murmur3"; // murmur3, crc32, md5
        private int bucketCount = 1024;
        private String hashField = "profile_id"; // profile_id, linkedin_url
        private List<Integer> hashRanges; // e.g., [0-255], [256-511], etc.
    }
    
    // Convenience methods for shard resolution
    public String resolveShardByLocation(String country, String region, String state) {
        if (!enabled) return "default";
        
        // Priority order: state -> region -> country
        if (state != null && stateToRegion != null) {
            String region_mapped = stateToRegion.get(state.toUpperCase());
            if (region_mapped != null) {
                return findShardByRegion(region_mapped);
            }
        }
        
        if (country != null && countryToShard != null) {
            return countryToShard.getOrDefault(country.toUpperCase(), "shard_international");
        }
        
        return "shard_default";
    }
    
    private String findShardByRegion(String region) {
        return shards.stream()
            .filter(shard -> shard.getGeographic() != null && 
                            shard.getGeographic().getRegions() != null &&
                            shard.getGeographic().getRegions().contains(region))
            .map(ShardDefinition::getShardId)
            .findFirst()
            .orElse("shard_default");
    }
    
    public String resolveShardByHash(String profileId) {
        if (!enabled) return "default";
        
        // Simple hash-based distribution
        int hash = Math.abs(profileId.hashCode());
        int shardIndex = hash % defaultShardCount;
        return "shard_" + (shardIndex + 1);
    }
    
    public List<String> getAllActiveShardIds() {
        return shards.stream()
            .filter(ShardDefinition::isActive)
            .map(ShardDefinition::getShardId)
            .toList();
    }
    
    public ShardDefinition getShardDefinition(String shardId) {
        return shards.stream()
            .filter(shard -> shard.getShardId().equals(shardId))
            .findFirst()
            .orElse(null);
    }
}