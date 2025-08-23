package com.semantictalent.finder.controller;

import com.semantictalent.finder.entity.Profile;
import com.semantictalent.finder.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/simple")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class SimpleSearchController {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @GetMapping("/profiles")
    public ResponseEntity<List<Profile>> getAllProfiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit) {
        
        log.info("Getting all profiles - page: {}, limit: {}", page, limit);
        
        try {
            Pageable pageable = PageRequest.of(page, limit);
            List<Profile> profiles = profileRepository.findAll(pageable).getContent();
            return ResponseEntity.ok(profiles);
        } catch (Exception e) {
            log.error("Error getting all profiles", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/search")
    public ResponseEntity<List<Profile>> searchProfiles(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        log.info("Simple text search for: {}", query);
        
        try {
            // Simple text search across multiple fields
            List<Profile> profiles = profileRepository.findBySearchableContentContainingIgnoreCase(query);
            log.info("Found {} profiles matching '{}'", profiles.size(), query);
            return ResponseEntity.ok(profiles);
        } catch (Exception e) {
            log.error("Error in simple search", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/search/location")
    public ResponseEntity<List<Profile>> searchByLocation(@RequestParam String location) {
        log.info("Searching profiles by location: {}", location);
        
        try {
            List<Profile> profiles = profileRepository.findByLocationContainingIgnoreCase(location);
            log.info("Found {} profiles in location '{}'", profiles.size(), location);
            return ResponseEntity.ok(profiles);
        } catch (Exception e) {
            log.error("Error searching by location", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}