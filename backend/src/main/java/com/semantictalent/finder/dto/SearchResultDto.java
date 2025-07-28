package com.semantictalent.finder.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private List<ProfileSummaryDto> profiles;
    private Integer totalResults;
    private Double executionTimeMs;
    private String processedQuery;
    private List<String> suggestions;
    private Map<String, Object> aggregations;   // Industry/location/skills breakdown
    private SearchMetadata metadata;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchMetadata {
        private String searchId;
        private SearchRequestDto.SearchMode mode;
        private Double avgSimilarityScore;
        private Integer highQualityProfiles;
        private Map<String, Integer> skillsDistribution;
        private Map<String, Integer> locationDistribution;
        private Map<String, Integer> industryDistribution;
    }
}