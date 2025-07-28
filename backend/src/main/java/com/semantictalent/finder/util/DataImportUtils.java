package com.semantictalent.finder.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.semantictalent.finder.entity.Profile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

@Slf4j
public class DataImportUtils {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Parse JSON file containing profile data
     * @param file The uploaded JSON file
     * @return List of Profile entities
     */
    public static List<Profile> parseJsonProfiles(MultipartFile file) {
        List<Profile> profiles = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            
            StringBuilder jsonContent = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonContent.append(line);
            }
            
            JsonNode rootNode = objectMapper.readTree(jsonContent.toString());
            
            if (rootNode.isArray()) {
                // Handle array of profiles
                for (JsonNode profileNode : rootNode) {
                    Profile profile = parseProfileFromJson(profileNode);
                    if (profile != null) {
                        profiles.add(profile);
                    }
                }
            } else {
                // Handle single profile
                Profile profile = parseProfileFromJson(rootNode);
                if (profile != null) {
                    profiles.add(profile);
                }
            }
            
            log.info("Successfully parsed {} profiles from JSON file", profiles.size());
            
        } catch (Exception e) {
            log.error("Error parsing JSON profiles from file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to parse JSON file", e);
        }
        
        return profiles;
    }
    
    /**
     * Parse CSV file containing profile data
     * @param file The uploaded CSV file
     * @return List of Profile entities
     */
    public static List<Profile> parseCsvProfiles(MultipartFile file) {
        List<Profile> profiles = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            
            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new RuntimeException("CSV file is empty");
            }
            
            String[] headers = headerLine.split(",");
            log.debug("CSV headers: {}", Arrays.toString(headers));
            
            String line;
            int lineNumber = 1;
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                try {
                    Profile profile = parseProfileFromCsv(line, headers);
                    if (profile != null) {
                        profiles.add(profile);
                    }
                } catch (Exception e) {
                    log.warn("Error parsing CSV line {}: {}", lineNumber, e.getMessage());
                }
            }
            
            log.info("Successfully parsed {} profiles from CSV file", profiles.size());
            
        } catch (Exception e) {
            log.error("Error parsing CSV profiles from file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to parse CSV file", e);
        }
        
        return profiles;
    }
    
    /**
     * Parse a single profile from JSON node
     */
    private static Profile parseProfileFromJson(JsonNode profileNode) {
        try {
            Profile profile = new Profile();
            
            profile.setFullName(getStringValue(profileNode, "fullName", "full_name", "name"));
            profile.setHeadline(getStringValue(profileNode, "headline", "title"));
            profile.setSummary(getStringValue(profileNode, "summary", "description", "bio"));
            profile.setLocation(getStringValue(profileNode, "location", "city", "region"));
            profile.setIndustry(getStringValue(profileNode, "industry", "sector"));
            profile.setExperienceLevel(getStringValue(profileNode, "experienceLevel", "experience_level", "level"));
            profile.setCompanyName(getStringValue(profileNode, "companyName", "company_name", "company"));
            profile.setJobTitle(getStringValue(profileNode, "jobTitle", "job_title", "position"));
            
            // Parse years of experience
            JsonNode yearsExpNode = getJsonValue(profileNode, "yearsExperience", "years_experience", "experience_years");
            if (yearsExpNode != null && yearsExpNode.isNumber()) {
                profile.setYearsExperience(yearsExpNode.asInt());
            }
            
            // Parse skills array
            JsonNode skillsNode = getJsonValue(profileNode, "skills", "skill_list");
            if (skillsNode != null && skillsNode.isArray()) {
                List<String> skillsList = new ArrayList<>();
                for (JsonNode skillNode : skillsNode) {
                    if (skillNode.isTextual()) {
                        skillsList.add(skillNode.asText());
                    }
                }
                profile.setSkills(skillsList.toArray(new String[0]));
            }
            
            return profile;
            
        } catch (Exception e) {
            log.error("Error parsing profile from JSON: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Parse a single profile from CSV line
     */
    private static Profile parseProfileFromCsv(String line, String[] headers) {
        try {
            String[] values = parseCsvLine(line);
            if (values.length != headers.length) {
                throw new RuntimeException("CSV line has " + values.length + " values but " + headers.length + " headers");
            }
            
            Profile profile = new Profile();
            
            for (int i = 0; i < headers.length; i++) {
                String header = headers[i].trim().toLowerCase();
                String value = values[i].trim();
                
                if (value.isEmpty()) continue;
                
                switch (header) {
                    case "fullname":
                    case "full_name":
                    case "name":
                        profile.setFullName(value);
                        break;
                    case "headline":
                    case "title":
                        profile.setHeadline(value);
                        break;
                    case "summary":
                    case "description":
                    case "bio":
                        profile.setSummary(value);
                        break;
                    case "location":
                    case "city":
                    case "region":
                        profile.setLocation(value);
                        break;
                    case "industry":
                    case "sector":
                        profile.setIndustry(value);
                        break;
                    case "experiencelevel":
                    case "experience_level":
                    case "level":
                        profile.setExperienceLevel(value);
                        break;
                    case "companyname":
                    case "company_name":
                    case "company":
                        profile.setCompanyName(value);
                        break;
                    case "jobtitle":
                    case "job_title":
                    case "position":
                        profile.setJobTitle(value);
                        break;
                    case "yearsexperience":
                    case "years_experience":
                    case "experience_years":
                        try {
                            profile.setYearsExperience(Integer.parseInt(value));
                        } catch (NumberFormatException e) {
                            log.warn("Invalid years experience value: {}", value);
                        }
                        break;
                    case "skills":
                    case "skill_list":
                        String[] skills = value.split("[;|,]"); // Split by semicolon, pipe, or comma
                        for (int j = 0; j < skills.length; j++) {
                            skills[j] = skills[j].trim();
                        }
                        profile.setSkills(skills);
                        break;
                }
            }
            
            return profile;
            
        } catch (Exception e) {
            log.error("Error parsing profile from CSV line: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Parse CSV line handling quoted values
     */
    private static String[] parseCsvLine(String line) {
        List<String> values = new ArrayList<>();
        StringBuilder currentValue = new StringBuilder();
        boolean inQuotes = false;
        
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                values.add(currentValue.toString());
                currentValue = new StringBuilder();
            } else {
                currentValue.append(c);
            }
        }
        
        values.add(currentValue.toString());
        return values.toArray(new String[0]);
    }
    
    /**
     * Get string value from JSON node with multiple possible field names
     */
    private static String getStringValue(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            JsonNode fieldNode = node.get(fieldName);
            if (fieldNode != null && fieldNode.isTextual()) {
                return fieldNode.asText();
            }
        }
        return null;
    }
    
    /**
     * Get JSON value from node with multiple possible field names
     */
    private static JsonNode getJsonValue(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            JsonNode fieldNode = node.get(fieldName);
            if (fieldNode != null) {
                return fieldNode;
            }
        }
        return null;
    }
}