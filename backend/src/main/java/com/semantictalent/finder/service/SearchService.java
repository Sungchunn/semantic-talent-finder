package com.semantictalent.finder.service;

import com.semantictalent.finder.dto.SearchRequestDto;
import com.semantictalent.finder.dto.SearchResultDto;
import com.semantictalent.finder.entity.SearchQuery;
import com.semantictalent.finder.repository.SearchQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class SearchService {
    
    @Autowired
    private SemanticSearchService semanticSearchService;
    
    @Autowired
    private SearchQueryRepository searchQueryRepository;
    
    public SearchResultDto performSearch(SearchRequestDto request, String userIp) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Perform the actual search
            SearchResultDto result = semanticSearchService.searchProfiles(request);
            
            // Log the search query for analytics
            logSearchQuery(request, result, userIp, (int)(System.currentTimeMillis() - startTime));
            
            return result;
            
        } catch (Exception e) {
            log.error("Error performing search", e);
            throw new RuntimeException("Search failed", e);
        }
    }
    
    public List<String> getSuggestions(String partialQuery) {
        return semanticSearchService.generateSuggestions(partialQuery);
    }
    
    public Map<String, List<String>> getAvailableFilters() {
        Map<String, List<String>> filters = new HashMap<>();
        
        // This would typically come from the database
        // For now, return empty structure - will be implemented with actual data
        filters.put("industries", List.of());
        filters.put("locations", List.of());
        filters.put("experienceLevels", List.of());
        
        return filters;
    }
    
    private void logSearchQuery(SearchRequestDto request, SearchResultDto result, String userIp, int executionTime) {
        try {
            SearchQuery searchQuery = new SearchQuery();
            searchQuery.setQueryText(request.getQuery());
            searchQuery.setUserIp(userIp);
            searchQuery.setResultsCount(result.getTotalResults());
            searchQuery.setExecutionTimeMs(executionTime);
            
            // Convert filters to JSON string if present
            if (request.getIndustries() != null || request.getLocations() != null || request.getExperienceLevel() != null) {
                Map<String, Object> filters = new HashMap<>();
                if (request.getIndustries() != null) filters.put("industries", request.getIndustries());
                if (request.getLocations() != null) filters.put("locations", request.getLocations());
                if (request.getExperienceLevel() != null) filters.put("experienceLevel", request.getExperienceLevel());
                
                // TODO: Convert to JSON string
                searchQuery.setFiltersApplied(filters.toString());
            }
            
            searchQueryRepository.save(searchQuery);
            
        } catch (Exception e) {
            log.warn("Failed to log search query", e);
            // Don't fail the search if logging fails
        }
    }
}