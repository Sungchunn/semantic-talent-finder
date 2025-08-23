package com.semantictalent.finder.service;

import com.semantictalent.finder.dto.ProfileDto;
import com.semantictalent.finder.entity.Profile;
import com.semantictalent.finder.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class ProfileService {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    @Autowired
    private ParquetImportService parquetImportService;
    
    public ProfileDto getProfileById(String id) {
        Optional<Profile> profile = profileRepository.findById(id);
        if (profile.isPresent()) {
            return convertToDto(profile.get());
        }
        throw new RuntimeException("Profile not found with id: " + id);
    }
    
    public void processBatchImport(MultipartFile file) {
        log.info("Starting batch import for file: {}", file.getOriginalFilename());
        
        try {
            // For uploaded files, delegate to parquet import service
            if (file.getOriginalFilename().endsWith(".parquet")) {
                // Save the file temporarily and start import
                String tempPath = "temp/" + file.getOriginalFilename();
                // In production, save the file and call parquetImportService.startImport(tempPath)
                log.info("Parquet file upload would be processed: {}", tempPath);
            } else {
                throw new IllegalArgumentException("Only parquet files are supported");
            }
            
        } catch (Exception e) {
            log.error("Batch import failed for file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Batch import failed: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> getProfileStats() {
        Map<String, Object> stats = new HashMap<>();
        
        Long totalProfiles = profileRepository.countTotalProfiles();
        List<String> industries = profileRepository.findDistinctIndustries();
        List<String> locations = profileRepository.findDistinctLocations();
        List<String> experienceLevels = profileRepository.findDistinctExperienceLevels();
        
        stats.put("totalProfiles", totalProfiles);
        stats.put("totalIndustries", industries.size());
        stats.put("totalLocations", locations.size());
        stats.put("experienceLevels", experienceLevels);
        stats.put("industries", industries.subList(0, Math.min(10, industries.size()))); // Top 10
        stats.put("locations", locations.subList(0, Math.min(10, locations.size()))); // Top 10
        
        return stats;
    }
    
    private ProfileDto convertToDto(Profile profile) {
        ProfileDto dto = new ProfileDto();
        dto.setId(profile.getId());
        dto.setFullName(profile.getFullName());
        dto.setHeadline(profile.getHeadline());
        dto.setSummary(profile.getSummary());
        dto.setLocation(profile.getLocation());
        dto.setIndustry(profile.getIndustry());
        dto.setExperienceLevel(profile.getExperienceLevel());
        dto.setSkills(profile.getSkills() != null ? Arrays.asList(profile.getSkills()) : null);
        dto.setCompanyName(profile.getCompanyName());
        dto.setJobTitle(profile.getJobTitle());
        dto.setYearsExperience(profile.getYearsExperience());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }
}