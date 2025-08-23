package com.semantictalent.finder.service;

import com.semantictalent.finder.dto.SearchRequestDto;
import com.semantictalent.finder.dto.SearchResultDto;
import com.semantictalent.finder.dto.ProfileSummaryDto;
import com.semantictalent.finder.entity.Profile;
import com.semantictalent.finder.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.pgvector.PGvector;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SemanticSearchService {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    public SearchResultDto searchProfiles(SearchRequestDto request) {
        long startTime = System.currentTimeMillis();
        
        try {
            log.info("Performing semantic search for query: {}", request.getQuery());
            
            // Check if we have any profiles in the database first
            long profileCount = profileRepository.count();
            if (profileCount == 0) {
                log.warn("No profiles found in database. Returning empty results.");
                return createEmptySearchResult(request, startTime);
            }
            
            // 1. Generate embedding for search query
            PGvector queryEmbedding;
            try {
                queryEmbedding = embeddingService.generateEmbedding(request.getQuery());
            } catch (Exception e) {
                log.error("Failed to generate embedding for query. This may be due to missing API key or service unavailability.", e);
                return createEmptySearchResult(request, startTime);
            }
            
            // 2. Perform vector similarity search
            List<Profile> similarProfiles = profileRepository.findSimilarProfiles(
                queryEmbedding, 
                request.getThreshold(), 
                request.getLimit()
            );
            
            // 3. Convert to DTOs with similarity scores
            List<ProfileSummaryDto> results = similarProfiles.stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
            
            // 4. Build response
            SearchResultDto response = new SearchResultDto();
            response.setProfiles(results);
            response.setTotalResults(results.size());
            response.setProcessedQuery(request.getQuery());
            response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
            response.setSuggestions(generateSuggestions(request.getQuery()));
            
            log.info("Search completed in {}ms, found {} profiles", 
                response.getExecutionTimeMs(), results.size());
            
            return response;
            
        } catch (Exception e) {
            log.error("Error performing semantic search", e);
            return createEmptySearchResult(request, startTime);
        }
    }
    
    private SearchResultDto createEmptySearchResult(SearchRequestDto request, long startTime) {
        SearchResultDto response = new SearchResultDto();
        response.setProfiles(new ArrayList<>());
        response.setTotalResults(0);
        response.setProcessedQuery(request.getQuery());
        response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
        response.setSuggestions(generateSuggestions(request.getQuery()));
        
        log.info("Returning empty search results for query: {}", request.getQuery());
        return response;
    }
    
    public List<String> generateSuggestions(String query) {
        // TODO: Implement AI-powered search suggestions
        List<String> suggestions = new ArrayList<>();
        
        // For now, return some basic suggestions based on common search patterns
        if (query.toLowerCase().contains("java")) {
            suggestions.add("Senior Java developers with Spring Boot experience");
            suggestions.add("Java developers in fintech industry");
            suggestions.add("Full-stack Java developers with React experience");
        } else if (query.toLowerCase().contains("react")) {
            suggestions.add("React developers with TypeScript experience");
            suggestions.add("Frontend React developers in startups");
            suggestions.add("Senior React developers with Node.js background");
        }
        
        return suggestions;
    }
    
    public List<String> getAvailableFilters() {
        // TODO: Implement dynamic filter generation
        return Arrays.asList("industry", "location", "experienceLevel", "skills");
    }
    
    private ProfileSummaryDto convertToSummaryDto(Profile profile) {
        ProfileSummaryDto dto = new ProfileSummaryDto();
        dto.setId(profile.getId());
        dto.setFullName(profile.getFullName());
        dto.setHeadline(profile.getHeadline());
        dto.setLocation(profile.getLocation());
        dto.setIndustry(profile.getIndustry());
        dto.setCompanyName(profile.getCompanyName());
        dto.setJobTitle(profile.getJobTitle());
        
        // TODO: Calculate actual similarity score from vector distance
        dto.setSimilarityScore(0.85); // Placeholder
        
        // TODO: Implement skill matching logic
        dto.setMatchingSkills(profile.getSkills() != null ? 
            Arrays.asList(profile.getSkills()).subList(0, Math.min(3, profile.getSkills().length)) : 
            new ArrayList<>());
        
        return dto;
    }
}