package com.semantictalent.finder.dto;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class ProfileDto {
    private String id;
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