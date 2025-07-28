package com.semantictalent.finder.controller;

import com.semantictalent.finder.dto.SearchRequestDto;
import com.semantictalent.finder.dto.SearchResultDto;
import com.semantictalent.finder.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class SearchController {
    
    @Autowired
    private SearchService searchService;
    
    @PostMapping("/semantic")
    public ResponseEntity<SearchResultDto> semanticSearch(
            @Valid @RequestBody SearchRequestDto request,
            HttpServletRequest httpRequest) {
        
        log.info("Received semantic search request: {}", request.getQuery());
        
        try {
            String userIp = getClientIpAddress(httpRequest);
            SearchResultDto results = searchService.performSearch(request, userIp);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Error processing search request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSearchSuggestions(
            @RequestParam String query) {
        
        try {
            List<String> suggestions = searchService.getSuggestions(query);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            log.error("Error getting search suggestions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/filters")
    public ResponseEntity<Map<String, List<String>>> getAvailableFilters() {
        try {
            Map<String, List<String>> filters = searchService.getAvailableFilters();
            return ResponseEntity.ok(filters);
        } catch (Exception e) {
            log.error("Error getting available filters", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}