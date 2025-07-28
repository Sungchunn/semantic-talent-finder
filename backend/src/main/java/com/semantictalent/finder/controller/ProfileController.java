package com.semantictalent.finder.controller;

import com.semantictalent.finder.dto.ProfileDto;
import com.semantictalent.finder.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable String id) {
        try {
            ProfileDto profile = profileService.getProfileById(id);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            log.error("Profile not found: {}", id, e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error retrieving profile: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/batch-import")
    public ResponseEntity<String> importProfiles(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            
            log.info("Starting batch import for file: {}", file.getOriginalFilename());
            profileService.processBatchImport(file);
            
            return ResponseEntity.ok("Import started successfully");
        } catch (Exception e) {
            log.error("Error processing batch import", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Import failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            Map<String, Object> stats = profileService.getProfileStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error retrieving profile statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}