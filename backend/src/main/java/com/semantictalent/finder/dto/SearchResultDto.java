package com.semantictalent.finder.dto;

import lombok.Data;
import java.util.List;

@Data
public class SearchResultDto {
    private List<ProfileSummaryDto> profiles;
    private Integer totalResults;
    private Double executionTimeMs;
    private String processedQuery;
    private List<String> suggestions;
}