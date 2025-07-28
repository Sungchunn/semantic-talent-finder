package com.semantictalent.finder.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProfileSummaryDto {
    private String id;
    private String fullName;
    private String headline;
    private String location;
    private String industry;
    private String companyName;
    private String jobTitle;
    private Double similarityScore;
    private List<String> matchingSkills;
}