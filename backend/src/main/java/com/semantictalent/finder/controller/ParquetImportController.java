package com.semantictalent.finder.controller;

import com.semantictalent.finder.dto.ImportStatusDto;
import com.semantictalent.finder.service.ParquetImportService;
import com.semantictalent.finder.service.ShardCoordinatorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/import")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ParquetImportController {
    
    @Autowired
    private ParquetImportService parquetImportService;
    
    @Autowired
    private ShardCoordinatorService shardCoordinator;
    
    /**
     * Import parquet file with intelligent shard placement
     * POST /api/import/parquet
     */
    @PostMapping("/parquet")
    public ResponseEntity<Map<String, Object>> importParquetFile(@RequestBody Map<String, String> request) {
        try {
            String filename = request.get("filename");
            if (filename == null || filename.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Filename is required"
                ));
            }
            
            log.info("Starting parquet import for file: {}", filename);
            
            // Start async import process
            ImportStatusDto importStatus = parquetImportService.startImport(filename);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Import started successfully");
            response.put("importId", importStatus.getBatchId());
            response.put("filename", filename);
            response.put("status", "STARTED");
            response.put("estimatedRecords", 51_352_619L);
            response.put("estimatedTimeMinutes", 45);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to start parquet import", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Import failed: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Get import status
     * GET /api/import/status/{importId}
     */
    @GetMapping("/status/{importId}")
    public ResponseEntity<ImportStatusDto> getImportStatus(@PathVariable String importId) {
        try {
            ImportStatusDto status = parquetImportService.getImportStatus(importId);
            
            if (status == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(status);
            
        } catch (Exception e) {
            log.error("Failed to get import status for {}", importId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get all active imports
     * GET /api/import/active
     */
    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveImports() {
        try {
            Map<String, ImportStatusDto> activeImports = parquetImportService.getAllActiveImports();
            
            Map<String, Object> response = new HashMap<>();
            response.put("activeImports", activeImports.size());
            response.put("imports", activeImports);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to get active imports", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Cancel an import
     * POST /api/import/cancel/{importId}
     */
    @PostMapping("/cancel/{importId}")
    public ResponseEntity<Map<String, Object>> cancelImport(@PathVariable String importId) {
        try {
            boolean cancelled = parquetImportService.cancelImport(importId);
            
            Map<String, Object> response = new HashMap<>();
            if (cancelled) {
                response.put("success", true);
                response.put("message", "Import cancelled successfully");
            } else {
                response.put("success", false);
                response.put("message", "Import not found or cannot be cancelled");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to cancel import {}", importId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Failed to cancel import: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Get import statistics and shard distribution
     * GET /api/import/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getImportStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Get shard coordinator health
            Map<String, Object> shardHealth = shardCoordinator.getCoordinatorHealth();
            stats.put("shardHealth", shardHealth);
            
            // Get import statistics
            Map<String, Object> importStats = parquetImportService.getImportStatistics();
            stats.put("importStats", importStats);
            
            // Expected distribution after import
            Map<String, Long> expectedDistribution = Map.of(
                "shard_usa_east", 15_234_567L,
                "shard_usa_west", 15_112_890L,
                "shard_usa_central", 12_890_123L,
                "shard_usa_south", 6_234_567L,
                "shard_international", 1_880_472L
            );
            stats.put("expectedDistribution", expectedDistribution);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            log.error("Failed to get import statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Test import with small sample (for development/testing)
     * POST /api/import/sample
     */
    @PostMapping("/sample")
    public ResponseEntity<Map<String, Object>> importSample(@RequestBody Map<String, Object> request) {
        try {
            String filename = (String) request.get("filename");
            Integer sampleSize = (Integer) request.getOrDefault("sampleSize", 10000);
            
            log.info("Starting sample import: {} records from {}", sampleSize, filename);
            
            ImportStatusDto importStatus = parquetImportService.startSampleImport(filename, sampleSize);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sample import started");
            response.put("importId", importStatus.getBatchId());
            response.put("sampleSize", sampleSize);
            response.put("estimatedTimeMinutes", 2);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to start sample import", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Sample import failed: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Health check for import system
     * GET /api/import/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getImportHealth() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // Check if parquet file exists
            boolean fileExists = parquetImportService.checkDataFileExists();
            health.put("dataFileExists", fileExists);
            
            // Check shard coordinator health
            Map<String, Object> coordinatorHealth = shardCoordinator.getCoordinatorHealth();
            health.put("shardCoordinator", coordinatorHealth);
            
            // Check import service status
            health.put("importServiceReady", true);
            health.put("maxConcurrentImports", 1);
            health.put("supportedFormats", new String[]{"parquet"});
            
            boolean allHealthy = fileExists && 
                                (Boolean) coordinatorHealth.getOrDefault("shardingEnabled", false);
            health.put("overallHealth", allHealthy ? "HEALTHY" : "DEGRADED");
            
            return ResponseEntity.ok(health);
            
        } catch (Exception e) {
            health.put("overallHealth", "ERROR");
            health.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(health);
        }
    }
}