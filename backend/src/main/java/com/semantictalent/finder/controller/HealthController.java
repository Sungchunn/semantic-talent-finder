package com.semantictalent.finder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.semantictalent.finder.repository.ProfileRepository;
import lombok.extern.slf4j.Slf4j;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class HealthController {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // Basic health check
            health.put("status", "UP");
            health.put("timestamp", System.currentTimeMillis());
            health.put("service", "semantic-talent-finder");
            
            // Database connectivity check
            Long profileCount = profileRepository.countTotalProfiles();
            health.put("database", "UP");
            health.put("profileCount", profileCount);
            
            log.debug("Health check passed - {} profiles in database", profileCount);
            
            return ResponseEntity.ok(health);
            
        } catch (Exception e) {
            log.error("Health check failed", e);
            
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            health.put("database", "DOWN");
            
            return ResponseEntity.ok(health); // Return 200 but with DOWN status
        }
    }
    
    @GetMapping("/readiness")
    public ResponseEntity<Map<String, String>> readinessCheck() {
        Map<String, String> readiness = new HashMap<>();
        
        try {
            // Check if application is ready to serve requests
            profileRepository.countTotalProfiles();
            
            readiness.put("status", "READY");
            readiness.put("message", "Application is ready to serve requests");
            
            return ResponseEntity.ok(readiness);
            
        } catch (Exception e) {
            log.error("Readiness check failed", e);
            
            readiness.put("status", "NOT_READY");
            readiness.put("message", "Application is not ready: " + e.getMessage());
            
            return ResponseEntity.ok(readiness);
        }
    }
    
    @GetMapping("/liveness")
    public ResponseEntity<Map<String, String>> livenessCheck() {
        Map<String, String> liveness = new HashMap<>();
        
        // Simple liveness check - if this endpoint responds, the app is alive
        liveness.put("status", "ALIVE");
        liveness.put("message", "Application is running");
        
        return ResponseEntity.ok(liveness);
    }
}