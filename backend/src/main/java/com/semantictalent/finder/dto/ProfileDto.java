package com.semantictalent.finder.dto;

import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class ProfileDto {
    private UUID id;
    private String fullName;
    private String headline;
    private String summary;
    private String location;
    private String industry;
    private String experienceLevel;
    private List<String> skills;
    private String companyName;
    private String jobTitle;
    private Integer yearsExperience;
    private Date createdAt;
    private Date updatedAt;
}