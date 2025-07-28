package com.semantictalent.finder.service;

import com.semantictalent.finder.dto.ImportStatusDto;
import com.semantictalent.finder.entity.Profile;
import com.semantictalent.finder.repository.ProfileRepository;
import com.pgvector.PGvector;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class DataImportService {
    
    @Value("${app.data.batch-size}")
    private Integer batchSize; // 5000 from analysis (67.5 MB memory/batch)
    
    @Value("${app.data.processing.max-threads}")
    private Integer maxThreads; // 4 from analysis
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    @Autowired
    private SkillsAnalysisService skillsService;
    
    @Async
    @Transactional
    public CompletableFuture<ImportStatusDto> processProfilesBatch(List<Profile> profiles, String filename) {
        log.info("Starting import batch for file: {} with {} profiles", filename, profiles.size());
        
        String batchId = UUID.randomUUID().toString();
        long startTime = System.currentTimeMillis();
        
        try {
            List<Profile> enrichedProfiles = new ArrayList<>();
            int processedCount = 0;
            
            for (Profile profile : profiles) {
                // Clean and enrich profile data
                Profile enrichedProfile = enrichProfile(profile, batchId);
                enrichedProfiles.add(enrichedProfile);
                processedCount++;
                
                // Process in chunks to manage memory
                if (enrichedProfiles.size() >= batchSize) {
                    saveBatch(enrichedProfiles);
                    enrichedProfiles.clear();
                    log.info("Processed chunk: {} records for batch {}", processedCount, batchId);
                }
            }
            
            // Process remaining records
            if (!enrichedProfiles.isEmpty()) {
                saveBatch(enrichedProfiles);
            }
            
            long executionTime = System.currentTimeMillis() - startTime;
            log.info("Completed import batch {}: {} records processed in {}ms", 
                    batchId, processedCount, executionTime);
            
            return CompletableFuture.completedFuture(
                ImportStatusDto.builder()
                    .batchId(batchId)
                    .filename(filename)
                    .status("COMPLETED")
                    .totalRecords((long) profiles.size())
                    .processedRecords((long) processedCount)
                    .failedRecords(0L)
                    .progressPercentage(100.0)
                    .executionTimeMs(executionTime)
                    .build()
            );
            
        } catch (Exception e) {
            log.error("Error processing import batch: {}", batchId, e);
            
            return CompletableFuture.completedFuture(
                ImportStatusDto.builder()
                    .batchId(batchId)
                    .filename(filename)
                    .status("FAILED")
                    .errorMessage(e.getMessage())
                    .build()
            );
        }
    }
    
    private Profile enrichProfile(Profile profile, String batchId) {
        // Calculate data quality score based on analysis
        double qualityScore = calculateDataQualityScore(profile);
        profile.setDataQualityScore(qualityScore);
        
        // Calculate completeness score
        double completenessScore = calculateCompletenessScore(profile);
        profile.setCompletenessScore(completenessScore);
        
        // Normalize and categorize skills if available
        if (profile.getSkills() != null && skillsService != null) {
            try {
                String[] normalizedSkills = skillsService.normalizeSkills(profile.getSkills());
                profile.setSkills(normalizedSkills);
                
                // Separate technical and soft skills
                profile.setTechnicalSkills(skillsService.extractTechnicalSkills(normalizedSkills));
                profile.setSoftSkills(skillsService.extractSoftSkills(normalizedSkills));
            } catch (Exception e) {
                log.warn("Error processing skills for profile {}: {}", profile.getId(), e.getMessage());
            }
        }
        
        // Build searchable content for embeddings
        String searchableContent = buildSearchableContent(profile);
        profile.setSearchableContent(searchableContent);
        
        // Generate embedding (if content is available)
        if (searchableContent != null && !searchableContent.trim().isEmpty()) {
            try {
                PGvector embedding = embeddingService.generateEmbedding(searchableContent);
                profile.setEmbedding(embedding);
            } catch (Exception e) {
                log.warn("Error generating embedding for profile {}: {}", profile.getId(), e.getMessage());
            }
        }
        
        profile.setImportBatchId(batchId);
        return profile;
    }
    
    private double calculateDataQualityScore(Profile profile) {
        double score = 0.0;
        int maxScore = 10;
        
        // High-quality fields (based on analysis - 0-3% null)
        if (profile.getFullName() != null && !profile.getFullName().trim().isEmpty()) score += 2;
        if (profile.getLocation() != null && !profile.getLocation().trim().isEmpty()) score += 1;
        if (profile.getLinkedinUrl() != null && !profile.getLinkedinUrl().trim().isEmpty()) score += 1;
        if (profile.getLocationCountry() != null && !profile.getLocationCountry().trim().isEmpty()) score += 1;
        
        // Medium-quality fields (based on analysis - 11-19% null)
        if (profile.getIndustry() != null && !profile.getIndustry().trim().isEmpty()) score += 1;
        if (profile.getJobTitle() != null && !profile.getJobTitle().trim().isEmpty()) score += 1;
        
        // Content richness
        if (profile.getSkills() != null && profile.getSkills().length > 0) score += 2;
        if (profile.getSummary() != null && profile.getSummary().length() > 100) score += 1;
        
        return score / maxScore;
    }
    
    private double calculateCompletenessScore(Profile profile) {
        int filledFields = 0;
        int totalFields = 20; // Major fields count
        
        if (profile.getFullName() != null && !profile.getFullName().trim().isEmpty()) filledFields++;
        if (profile.getFirstName() != null && !profile.getFirstName().trim().isEmpty()) filledFields++;
        if (profile.getLastName() != null && !profile.getLastName().trim().isEmpty()) filledFields++;
        if (profile.getLocation() != null && !profile.getLocation().trim().isEmpty()) filledFields++;
        if (profile.getLocationCountry() != null && !profile.getLocationCountry().trim().isEmpty()) filledFields++;
        if (profile.getIndustry() != null && !profile.getIndustry().trim().isEmpty()) filledFields++;
        if (profile.getJobTitle() != null && !profile.getJobTitle().trim().isEmpty()) filledFields++;
        if (profile.getCompanyName() != null && !profile.getCompanyName().trim().isEmpty()) filledFields++;
        if (profile.getHeadline() != null && !profile.getHeadline().trim().isEmpty()) filledFields++;
        if (profile.getSummary() != null && !profile.getSummary().trim().isEmpty()) filledFields++;
        if (profile.getLinkedinUrl() != null && !profile.getLinkedinUrl().trim().isEmpty()) filledFields++;
        if (profile.getSkills() != null && profile.getSkills().length > 0) filledFields++;
        if (profile.getYearsExperience() != null) filledFields++;
        if (profile.getExperienceLevel() != null && !profile.getExperienceLevel().trim().isEmpty()) filledFields++;
        if (profile.getGender() != null && !profile.getGender().trim().isEmpty()) filledFields++;
        if (profile.getLocality() != null && !profile.getLocality().trim().isEmpty()) filledFields++;
        if (profile.getRegion() != null && !profile.getRegion().trim().isEmpty()) filledFields++;
        if (profile.getMetro() != null && !profile.getMetro().trim().isEmpty()) filledFields++;
        if (profile.getLinkedinUsername() != null && !profile.getLinkedinUsername().trim().isEmpty()) filledFields++;
        if (profile.getLastUpdated() != null) filledFields++;
        
        return (double) filledFields / totalFields;
    }
    
    private String buildSearchableContent(Profile profile) {
        StringBuilder content = new StringBuilder();
        
        // Prioritize high-quality fields from analysis
        appendIfNotNull(content, profile.getFullName());
        appendIfNotNull(content, profile.getJobTitle());
        appendIfNotNull(content, profile.getHeadline());
        appendIfNotNull(content, profile.getIndustry());
        appendIfNotNull(content, profile.getLocation());
        appendIfNotNull(content, profile.getLocationCountry());
        appendIfNotNull(content, profile.getCompanyName());
        appendIfNotNull(content, profile.getSummary());
        
        // Add skills
        if (profile.getSkills() != null) {
            content.append(" ").append(String.join(" ", profile.getSkills()));
        }
        
        return content.toString().trim();
    }
    
    private void appendIfNotNull(StringBuilder content, String value) {
        if (value != null && !value.trim().isEmpty()) {
            content.append(" ").append(value);
        }
    }
    
    @Transactional
    private void saveBatch(List<Profile> profiles) {
        try {
            profileRepository.saveAll(profiles);
            log.debug("Saved batch of {} profiles", profiles.size());
        } catch (Exception e) {
            log.error("Error saving batch of {} profiles: {}", profiles.size(), e.getMessage());
            throw e;
        }
    }
}