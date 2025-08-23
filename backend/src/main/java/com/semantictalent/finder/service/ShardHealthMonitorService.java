package com.semantictalent.finder.service;

import com.semantictalent.finder.config.ShardConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.HashMap;

@Service
@Slf4j
public class ShardHealthMonitorService {
    
    @Autowired
    private ShardConfig shardConfig;
    
    // Shard health status cache
    private final Map<String, ShardHealth> shardHealthCache = new ConcurrentHashMap<>();
    
    // Shard performance metrics
    private final Map<String, ShardMetrics> shardMetricsCache = new ConcurrentHashMap<>();
    
    public static class ShardHealth {
        private boolean healthy;
        private LocalDateTime lastChecked;
        private String errorMessage;
        private long responseTimeMs;
        private long recordCount;
        
        public ShardHealth(boolean healthy, LocalDateTime lastChecked, String errorMessage, 
                          long responseTimeMs, long recordCount) {
            this.healthy = healthy;
            this.lastChecked = lastChecked;
            this.errorMessage = errorMessage;
            this.responseTimeMs = responseTimeMs;
            this.recordCount = recordCount;
        }
        
        // Getters
        public boolean isHealthy() { return healthy; }
        public LocalDateTime getLastChecked() { return lastChecked; }
        public String getErrorMessage() { return errorMessage; }
        public long getResponseTimeMs() { return responseTimeMs; }
        public long getRecordCount() { return recordCount; }
    }
    
    public static class ShardMetrics {
        private long totalQueries;
        private long avgResponseTimeMs;
        private long totalRecords;
        private double storageSizeGb;
        private LocalDateTime lastUpdated;
        private int errorCount;
        private double successRate;
        
        public ShardMetrics(long totalQueries, long avgResponseTimeMs, long totalRecords,
                           double storageSizeGb, LocalDateTime lastUpdated, int errorCount) {
            this.totalQueries = totalQueries;
            this.avgResponseTimeMs = avgResponseTimeMs;
            this.totalRecords = totalRecords;
            this.storageSizeGb = storageSizeGb;
            this.lastUpdated = lastUpdated;
            this.errorCount = errorCount;
            this.successRate = totalQueries > 0 ? (double)(totalQueries - errorCount) / totalQueries * 100 : 100.0;
        }
        
        // Getters
        public long getTotalQueries() { return totalQueries; }
        public long getAvgResponseTimeMs() { return avgResponseTimeMs; }
        public long getTotalRecords() { return totalRecords; }
        public double getStorageSizeGb() { return storageSizeGb; }
        public LocalDateTime getLastUpdated() { return lastUpdated; }
        public int getErrorCount() { return errorCount; }
        public double getSuccessRate() { return successRate; }
    }
    
    /**
     * Check if a specific shard is healthy and available for queries
     */
    public boolean isShardHealthy(String shardId) {
        ShardHealth health = shardHealthCache.get(shardId);
        
        if (health == null) {
            // Perform immediate health check if not cached
            return performHealthCheck(shardId);
        }
        
        // Consider stale if last check was more than 5 minutes ago
        if (health.lastChecked.isBefore(LocalDateTime.now().minusMinutes(5))) {
            return performHealthCheck(shardId);
        }
        
        return health.healthy;
    }
    
    /**
     * Get current record count for a shard
     */
    public long getShardRecordCount(String shardId) {
        ShardHealth health = shardHealthCache.get(shardId);
        return health != null ? health.recordCount : 0L;
    }
    
    /**
     * Perform immediate health check on a specific shard
     */
    public boolean performHealthCheck(String shardId) {
        long startTime = System.currentTimeMillis();
        
        try {
            ShardConfig.ShardDefinition shard = shardConfig.getShardDefinition(shardId);
            if (shard == null || !shard.isActive()) {
                updateShardHealth(shardId, false, "Shard not configured or inactive", 0, 0);
                return false;
            }
            
            // Simulate database connectivity check
            // In real implementation, this would create a connection to the shard database
            long recordCount = checkShardDatabase(shard);
            long responseTime = System.currentTimeMillis() - startTime;
            
            if (recordCount >= 0) {
                updateShardHealth(shardId, true, null, responseTime, recordCount);
                log.debug("Health check passed for shard {}: {} records, {}ms response", 
                         shardId, recordCount, responseTime);
                return true;
            } else {
                updateShardHealth(shardId, false, "Database query failed", responseTime, 0);
                log.warn("Health check failed for shard {}: database query failed", shardId);
                return false;
            }
            
        } catch (Exception e) {
            long responseTime = System.currentTimeMillis() - startTime;
            updateShardHealth(shardId, false, e.getMessage(), responseTime, 0);
            log.error("Health check failed for shard {}: {}", shardId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Simulate shard database connectivity check
     * In production, this would use actual DataSource connections
     */
    private long checkShardDatabase(ShardConfig.ShardDefinition shard) {
        try {
            // For now, simulate different record counts per shard based on our architecture
            return switch (shard.getShardId()) {
                case "shard_usa_east" -> 15_234_567L;
                case "shard_usa_west" -> 15_112_890L;
                case "shard_usa_central" -> 12_890_123L;
                case "shard_usa_south" -> 6_234_567L;
                case "shard_international" -> 1_880_472L;
                default -> 0L;
            };
            
            // In production, this would be:
            // JdbcTemplate jdbcTemplate = new JdbcTemplate(getShardDataSource(shard));
            // return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM profiles", Long.class);
            
        } catch (Exception e) {
            log.error("Database connectivity check failed for shard {}: {}", shard.getShardId(), e.getMessage());
            return -1L;
        }
    }
    
    private void updateShardHealth(String shardId, boolean healthy, String errorMessage, 
                                  long responseTime, long recordCount) {
        ShardHealth health = new ShardHealth(healthy, LocalDateTime.now(), errorMessage, responseTime, recordCount);
        shardHealthCache.put(shardId, health);
    }
    
    /**
     * Scheduled health check for all active shards (every 2 minutes)
     */
    @Scheduled(fixedRate = 120000) // 2 minutes
    public void scheduledHealthCheck() {
        if (!shardConfig.isEnabled()) {
            return;
        }
        
        log.debug("Starting scheduled health check for {} shards", shardConfig.getAllActiveShardIds().size());
        
        shardConfig.getAllActiveShardIds().forEach(shardId -> {
            try {
                performHealthCheck(shardId);
            } catch (Exception e) {
                log.error("Scheduled health check failed for shard {}: {}", shardId, e.getMessage());
            }
        });
        
        logHealthSummary();
    }
    
    /**
     * Update performance metrics for a shard after query execution
     */
    public void recordShardPerformance(String shardId, long responseTimeMs, boolean success) {
        ShardMetrics current = shardMetricsCache.get(shardId);
        
        if (current == null) {
            // Initialize metrics
            shardMetricsCache.put(shardId, new ShardMetrics(
                1L, responseTimeMs, 0L, 0.0, LocalDateTime.now(), success ? 0 : 1
            ));
        } else {
            // Update existing metrics
            long totalQueries = current.totalQueries + 1;
            long avgResponseTime = (current.avgResponseTimeMs * current.totalQueries + responseTimeMs) / totalQueries;
            int errorCount = current.errorCount + (success ? 0 : 1);
            
            shardMetricsCache.put(shardId, new ShardMetrics(
                totalQueries, avgResponseTime, current.totalRecords, 
                current.storageSizeGb, LocalDateTime.now(), errorCount
            ));
        }
    }
    
    /**
     * Get comprehensive health report for all shards
     */
    public Map<String, Object> getHealthReport() {
        Map<String, Object> report = new HashMap<>();
        
        // Overall health status
        long healthyShards = shardHealthCache.values().stream()
            .mapToLong(health -> health.healthy ? 1 : 0)
            .sum();
        
        report.put("totalShards", shardConfig.getAllActiveShardIds().size());
        report.put("healthyShards", healthyShards);
        report.put("healthPercentage", healthyShards * 100.0 / Math.max(1, shardConfig.getAllActiveShardIds().size()));
        report.put("lastCheck", LocalDateTime.now());
        
        // Individual shard details
        Map<String, Map<String, Object>> shardDetails = new HashMap<>();
        for (String shardId : shardConfig.getAllActiveShardIds()) {
            Map<String, Object> shardInfo = new HashMap<>();
            
            ShardHealth health = shardHealthCache.get(shardId);
            if (health != null) {
                shardInfo.put("healthy", health.healthy);
                shardInfo.put("lastChecked", health.lastChecked);
                shardInfo.put("responseTime", health.responseTimeMs);
                shardInfo.put("recordCount", health.recordCount);
                shardInfo.put("errorMessage", health.errorMessage);
            }
            
            ShardMetrics metrics = shardMetricsCache.get(shardId);
            if (metrics != null) {
                shardInfo.put("totalQueries", metrics.totalQueries);
                shardInfo.put("avgResponseTime", metrics.avgResponseTimeMs);
                shardInfo.put("successRate", metrics.successRate);
            }
            
            shardDetails.put(shardId, shardInfo);
        }
        
        report.put("shardDetails", shardDetails);
        return report;
    }
    
    /**
     * Get load balancing recommendations based on current health and performance
     */
    public Map<String, String> getLoadBalancingRecommendations() {
        Map<String, String> recommendations = new HashMap<>();
        
        for (String shardId : shardConfig.getAllActiveShardIds()) {
            ShardHealth health = shardHealthCache.get(shardId);
            ShardMetrics metrics = shardMetricsCache.get(shardId);
            
            if (health == null || !health.healthy) {
                recommendations.put(shardId, "UNAVAILABLE - Redirect traffic to healthy shards");
                continue;
            }
            
            if (metrics != null) {
                if (metrics.avgResponseTimeMs > 1000) {
                    recommendations.put(shardId, "HIGH_LATENCY - Consider adding read replicas or optimizing queries");
                } else if (metrics.successRate < 95.0) {
                    recommendations.put(shardId, "HIGH_ERROR_RATE - Investigate recent errors and consider failover");
                } else if (health.recordCount > 15_000_000) {
                    recommendations.put(shardId, "APPROACHING_CAPACITY - Plan for horizontal scaling");
                } else {
                    recommendations.put(shardId, "HEALTHY - Operating normally");
                }
            }
        }
        
        return recommendations;
    }
    
    private void logHealthSummary() {
        long healthy = shardHealthCache.values().stream().mapToLong(h -> h.healthy ? 1 : 0).sum();
        long total = shardHealthCache.size();
        
        if (healthy == total) {
            log.debug("All {} shards are healthy", total);
        } else {
            log.warn("Shard health: {}/{} healthy", healthy, total);
            
            shardHealthCache.entrySet().stream()
                .filter(entry -> !entry.getValue().healthy)
                .forEach(entry -> log.warn("Unhealthy shard {}: {}", 
                        entry.getKey(), entry.getValue().errorMessage));
        }
    }
}