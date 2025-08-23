package com.semantictalent.finder.service;

import com.semantictalent.finder.dto.BatchImportRequest;
import com.semantictalent.finder.dto.BatchImportResponse;
import com.semantictalent.finder.dto.ProfileImportDto;
import com.semantictalent.finder.entity.Profile;
import com.semantictalent.finder.repository.ProfileRepository;
import com.pgvector.PGvector;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class BatchImportService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private EmbeddingService embeddingService;

    // Store batch processing status
    private final ConcurrentHashMap<String, BatchImportResponse> batchStatus = new ConcurrentHashMap<>();

    @Transactional
    public BatchImportResponse processBatch(BatchImportRequest request) {
        String batchId = request.getBatchId();
        
        log.info("Processing batch {} with {} profiles", batchId, request.getProfiles().size());
        
        BatchImportResponse response = BatchImportResponse.builder()
            .batchId(batchId)
            .processedAt(LocalDateTime.now())
            .build();
        
        batchStatus.put(batchId, response);
        
        List<Profile> profiles = new ArrayList<>();
        int processedCount = 0;
        int failedCount = 0;
        
        try {
            for (ProfileImportDto dto : request.getProfiles()) {
                try {
                    Profile profile = convertToProfile(dto, batchId);
                    profiles.add(profile);
                    processedCount++;
                } catch (Exception e) {
                    log.warn("Failed to convert profile {}: {}", dto.getFullName(), e.getMessage());
                    failedCount++;
                }
            }
            
            // Batch save all profiles
            if (!profiles.isEmpty()) {
                profileRepository.saveAll(profiles);
                log.info("Saved {} profiles to database for batch {}", profiles.size(), batchId);
            }
            
            response.setSuccess(true);
            response.setProcessedCount(processedCount);
            response.setFailedCount(failedCount);
            
        } catch (Exception e) {
            log.error("Batch processing failed for {}", batchId, e);
            response.setSuccess(false);
            response.setErrorMessage(e.getMessage());
            response.setFailedCount(request.getProfiles().size());
        }
        
        batchStatus.put(batchId, response);
        return response;
    }
    
    private Profile convertToProfile(ProfileImportDto dto, String batchId) {
        Profile profile = new Profile();
        
        profile.setId(UUID.randomUUID());
        profile.setFullName(dto.getFullName());
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setJobTitle(dto.getJobTitle());
        profile.setCompanyName(dto.getCompanyName());
        profile.setIndustry(dto.getIndustry());
        profile.setLocation(dto.getLocation());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setSkills(dto.getSkills());
        profile.setSummary(dto.getSummary());
        profile.setImportBatchId(batchId);
        
        // Generate headline for embedding
        String headline = (dto.getJobTitle() != null ? dto.getJobTitle() : "Professional") + 
                         " at " + 
                         (dto.getCompanyName() != null ? dto.getCompanyName() : "Company");
        profile.setHeadline(headline);
        
        // Create searchable content
        StringBuilder searchableContent = new StringBuilder();
        if (dto.getFullName() != null) searchableContent.append(dto.getFullName()).append(" ");
        if (dto.getJobTitle() != null) searchableContent.append(dto.getJobTitle()).append(" ");
        if (dto.getCompanyName() != null) searchableContent.append(dto.getCompanyName()).append(" ");
        if (dto.getIndustry() != null) searchableContent.append(dto.getIndustry()).append(" ");
        if (dto.getSummary() != null) searchableContent.append(dto.getSummary()).append(" ");
        if (dto.getSkills() != null) {
            for (String skill : dto.getSkills()) {
                searchableContent.append(skill.trim()).append(" ");
            }
        }
        profile.setSearchableContent(searchableContent.toString().trim());
        
        // TODO: Temporarily disabled embedding generation due to PGvector serialization issue
        // Generate embedding (with error handling)
        /*
        try {
            PGvector embedding = embeddingService.generateProfileEmbedding(
                profile.getFullName(),
                profile.getHeadline(),
                profile.getSummary(),
                profile.getSkills()
            );
            profile.setEmbedding(embedding);
        } catch (Exception e) {
            log.warn("Failed to generate embedding for profile {}: {}", dto.getFullName(), e.getMessage());
            // Continue without embedding - database allows NULL
        }
        */
        
        // Skip embedding generation for now - focus on data import
        log.debug("Skipping embedding generation for profile {} - will be implemented later", dto.getFullName());
        
        return profile;
    }
    
    public BatchImportResponse getBatchStatus(String batchId) {
        return batchStatus.get(batchId);
    }
    
    public void clearBatchStatus(String batchId) {
        batchStatus.remove(batchId);
    }
}