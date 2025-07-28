package com.semantictalent.finder.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequestDto {
    @NotBlank(message = "Query cannot be empty")
    private String query;                       // "Senior Java developers in fintech"
    
    @Min(value = 1, message = "Limit must be at least 1")
    @Max(value = 100, message = "Limit cannot exceed 100")
    @Builder.Default
    private Integer limit = 20;                 // Number of results (max 100)
    
    @Min(value = 0, message = "Threshold must be between 0 and 1")
    @Max(value = 1, message = "Threshold must be between 0 and 1")
    @Builder.Default
    private Double threshold = 0.7;             // Similarity threshold
    
    private List<String> industries;            // Optional filters
    private List<String> locations;             // Optional filters
    private List<String> countries;             // Optional filters (based on location_country)
    private String experienceLevel;             // Optional filter
    private List<String> requiredSkills;        // Optional skills filter
    private List<String> excludedSkills;        // Optional exclusion filter
    private Integer minYearsExperience;         // Optional filter
    private Integer maxYearsExperience;         // Optional filter
    private Double minDataQualityScore;         // Filter by data quality (0.0-1.0)
    
    @Builder.Default
    private SearchMode mode = SearchMode.SEMANTIC; // Search type
    
    public enum SearchMode {
        SEMANTIC, FULL_TEXT, HYBRID
    }
}