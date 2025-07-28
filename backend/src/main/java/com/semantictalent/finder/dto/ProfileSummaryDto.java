package com.semantictalent.finder.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileSummaryDto {
    private String id;
    private String fullName;
    private String headline;
    private String location;
    private String locationCountry;           // Based on dataset analysis
    private String industry;
    private String companyName;
    private String jobTitle;
    private Double similarityScore;
    private Double dataQualityScore;         // Based on data quality analysis
    private List<String> matchingSkills;
    private List<String> allSkills;
    private List<String> technicalSkills;    // Separated technical skills
    private List<String> softSkills;         // Separated soft skills
    private Integer yearsExperience;
    private String linkedinUrl;
}