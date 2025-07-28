package com.semantictalent.finder.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Min;
import javax.validation.constraints.Max;
import java.util.List;

@Data
public class SearchRequestDto {
    @NotBlank(message = "Query cannot be empty")
    private String query;
    
    @Min(value = 1, message = "Limit must be at least 1")
    @Max(value = 100, message = "Limit cannot exceed 100")
    private Integer limit = 10;
    
    @Min(value = 0, message = "Threshold must be between 0 and 1")
    @Max(value = 1, message = "Threshold must be between 0 and 1")
    private Double threshold = 0.7;
    
    private List<String> industries;
    private List<String> locations;
    private String experienceLevel;
}