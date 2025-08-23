package com.semantictalent.finder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileImportDto {
    private String fullName;
    private String firstName;
    private String lastName;
    private String jobTitle;
    private String companyName;
    private String industry;
    private String location;
    private String linkedinUrl;
    private String[] skills;
    private String summary;
}