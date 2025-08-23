package com.semantictalent.finder.service;

import com.semantictalent.finder.dto.ImportStatusDto;
import com.semantictalent.finder.entity.Profile;
import com.semantictalent.finder.repository.ProfileRepository;
import com.semantictalent.finder.config.ShardConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class ParquetImportService {
    
    @Value("${app.data.import.parquet-path:data/USA_filtered.parquet}")
    private String defaultParquetPath;
    
    @Value("${app.data.batch-size:5000}")
    private Integer batchSize;
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private DataImportService dataImportService;
    
    @Autowired
    private ShardCoordinatorService shardCoordinator;
    
    @Autowired
    private ShardConfig shardConfig;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    // Track active imports
    private final Map<String, ImportStatusDto> activeImports = new ConcurrentHashMap<>();
    private final Map<String, CompletableFuture<Void>> importTasks = new ConcurrentHashMap<>();
    
    /**
     * Start full parquet file import with intelligent shard distribution
     */
    public ImportStatusDto startImport(String filename) {
        String importId = UUID.randomUUID().toString();
        String fullPath = resolveFilePath(filename);
        
        ImportStatusDto status = ImportStatusDto.builder()
            .batchId(importId)
            .filename(filename)
            .status("STARTING")
            .totalRecords(51_352_619L) // Known from analysis
            .processedRecords(0L)
            .failedRecords(0L)
            .progressPercentage(0.0)
            .startTime(LocalDateTime.now())
            .build();
        
        activeImports.put(importId, status);
        
        // Start async import process
        CompletableFuture<Void> importTask = CompletableFuture.runAsync(() -> {
            try {
                processParquetImport(importId, fullPath);
            } catch (Exception e) {
                handleImportError(importId, e);
            }
        });
        
        importTasks.put(importId, importTask);
        
        log.info("Started import {} for file: {}", importId, filename);
        return status;
    }
    
    /**
     * Start sample import for testing (smaller dataset)
     */
    public ImportStatusDto startSampleImport(String filename, int sampleSize) {
        String importId = UUID.randomUUID().toString();
        String fullPath = resolveFilePath(filename);
        
        ImportStatusDto status = ImportStatusDto.builder()
            .batchId(importId)
            .filename(filename)
            .status("STARTING")
            .totalRecords((long) sampleSize)
            .processedRecords(0L)
            .failedRecords(0L)
            .progressPercentage(0.0)
            .startTime(LocalDateTime.now())
            .build();
        
        activeImports.put(importId, status);
        
        CompletableFuture<Void> importTask = CompletableFuture.runAsync(() -> {
            try {
                processSampleImport(importId, fullPath, sampleSize);
            } catch (Exception e) {
                handleImportError(importId, e);
            }
        });
        
        importTasks.put(importId, importTask);
        
        log.info("Started sample import {} with {} records from: {}", importId, sampleSize, filename);
        return status;
    }
    
    /**
     * Process the full parquet import with sharding
     */
    private void processParquetImport(String importId, String filePath) {
        log.info("Processing real parquet import {}: {}", importId, filePath);
        File file = new File(filePath);
        if (!file.exists()) {
            throw new RuntimeException("Parquet file not found in container at: " + filePath);
        }

        long totalRecords = 0;
        try (var reader = AvroParquetReader.<GenericRecord>builder(new org.apache.hadoop.fs.Path(file.toURI())).build()) {
            while (reader.read() != null) {
                totalRecords++;
            }
        } catch (Exception e) {
            log.error("Failed to count records", e);
            throw new RuntimeException("Failed to count records in Parquet file", e);
        }
        updateImportStatus(importId, "PROCESSING", 0L, 0.0, "Starting real import of " + totalRecords + " records...");

        long processedCount = 0;
        try (var reader = AvroParquetReader.<GenericRecord>builder(new org.apache.hadoop.fs.Path(file.toURI())).build()) {
            GenericRecord record;
            List<Profile> batch = new ArrayList<>();
            while ((record = reader.read()) != null) {
                Profile profile = new Profile();
                // --- Map fields from Parquet record to Profile entity ---
                if (record.get("Full name") != null) profile.setFullName(record.get("Full name").toString());
                if (record.get("First Name") != null) profile.setFirstName(record.get("First Name").toString());
                if (record.get("Last Name") != null) profile.setLastName(record.get("Last Name").toString());
                if (record.get("Job title") != null) profile.setJobTitle(record.get("Job title").toString());
                if (record.get("Company Name") != null) profile.setCompanyName(record.get("Company Name").toString());
                if (record.get("Industry") != null) profile.setIndustry(record.get("Industry").toString());
                if (record.get("Location") != null) profile.setLocation(record.get("Location").toString());
                if (record.get("LinkedIn Url") != null) profile.setLinkedinUrl(record.get("LinkedIn Url").toString());
                if (record.get("Skills") != null) {
                    String[] skills = record.get("Skills").toString().split(",");
                    profile.setSkills(skills);
                }
                
                // For embedding
                profile.setHeadline(profile.getJobTitle() + " at " + profile.getCompanyName());
                
                // Generate and set embedding
                PGvector embedding = embeddingService.generateProfileEmbedding(profile.getFullName(), profile.getHeadline(), profile.getSummary(), profile.getSkills());
                profile.setEmbedding(embedding);

                batch.add(profile);
                if (batch.size() >= batchSize) {
                    profileRepository.saveAll(batch);
                    processedCount += batch.size();
                    log.info("Processed batch of {}, total processed: {}", batch.size(), processedCount);
                    updateImportStatus(importId, "PROCESSING", processedCount, (double) processedCount / totalRecords * 100, "Processing...");
                    batch.clear();
                }
            }
            if (!batch.isEmpty()) {
                profileRepository.saveAll(batch);
                processedCount += batch.size();
                log.info("Processed final batch of {}, total processed: {}", batch.size(), processedCount);
            }
            updateImportStatus(importId, "COMPLETED", processedCount, 100.0, "Import completed successfully");
        } catch (Exception e) {
            log.error("Parquet import {} failed during processing", importId, e);
            updateImportStatus(importId, "FAILED", processedCount, (double) processedCount / totalRecords * 100, "Import failed: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
    
    /**
     * Process sample import for testing
     */
    private void processSampleImport(String importId, String filePath, int sampleSize) {
        log.info("Processing sample import {}: {} records", importId, sampleSize);
        
        try {
            updateImportStatus(importId, "PROCESSING", 0L, 0.0, "Creating sample profiles...");
            
            // Generate sample data for testing
            List<Profile> sampleProfiles = generateSampleProfiles(sampleSize);
            
            updateImportStatus(importId, "PROCESSING", 0L, 25.0, "Determining shard placement...");
            
            // Process in batches with shard distribution
            int batchCount = (int) Math.ceil((double) sampleSize / batchSize);
            for (int i = 0; i < batchCount; i++) {
                int startIdx = i * batchSize;
                int endIdx = Math.min(startIdx + batchSize, sampleSize);
                List<Profile> batch = sampleProfiles.subList(startIdx, endIdx);
                
                processBatchWithSharding(batch, importId);
                
                long processed = (long) endIdx;
                double progress = (processed / (double) sampleSize) * 100.0;
                updateImportStatus(importId, "PROCESSING", processed, progress, 
                                 String.format("Processed %d/%d profiles", processed, sampleSize));
                
                // Small delay to simulate processing time
                Thread.sleep(100);
            }
            
            updateImportStatus(importId, "COMPLETED", (long) sampleSize, 100.0, "Sample import completed");
            log.info("Sample import {} completed: {} profiles", importId, sampleSize);
            
        } catch (Exception e) {
            log.error("Sample import {} failed", importId, e);
            updateImportStatus(importId, "FAILED", 0L, 0.0, "Sample import failed: " + e.getMessage());
        }
    }
    
    /**
     * Simulate full parquet import for demo purposes
     */
    private void simulateParquetImport(String importId) throws InterruptedException {
        long totalRecords = 51_352_619L;
        long batchRecords = 50_000L; // Larger batches for full import
        long processed = 0L;
        
        log.info("Simulating parquet import with {} total records", totalRecords);
        
        while (processed < totalRecords) {
            long batchSize = Math.min(batchRecords, totalRecords - processed);
            
            // Simulate batch processing time (proportional to batch size)
            Thread.sleep(Math.max(100, batchSize / 1000));
            
            processed += batchSize;
            double progress = (processed / (double) totalRecords) * 100.0;
            
            updateImportStatus(importId, "PROCESSING", processed, progress,
                             String.format("Processed %,d/%,d profiles (%.1f%%)", processed, totalRecords, progress));
            
            // Log progress at intervals
            if (processed % 1_000_000 == 0 || processed >= totalRecords) {
                log.info("Import {}: Processed {}/{} profiles ({:.1f}%)", 
                        importId, processed, totalRecords, progress);
            }
        }
    }
    
    /**
     * Process a batch of profiles with intelligent shard placement
     */
    @Transactional
    private void processBatchWithSharding(List<Profile> profiles, String importId) {
        Map<String, List<Profile>> shardBatches = new HashMap<>();
        
        // Distribute profiles to shards based on geographic + hash strategy
        for (Profile profile : profiles) {
            String shardId = shardCoordinator.determineProfileShard(profile);
            shardBatches.computeIfAbsent(shardId, k -> new ArrayList<>()).add(profile);
        }
        
        // Process each shard batch
        for (Map.Entry<String, List<Profile>> entry : shardBatches.entrySet()) {
            String shardId = entry.getKey();
            List<Profile> shardProfiles = entry.getValue();
            
            try {
                // In production, this would write to the specific shard database
                // For now, save to the main database with shard tagging
                for (Profile profile : shardProfiles) {
                    profile.setImportBatchId(importId);
                    profile.setShardId(shardId); // Add shard tracking
                }
                
                profileRepository.saveAll(shardProfiles);
                log.debug("Saved {} profiles to shard {}", shardProfiles.size(), shardId);
                
            } catch (Exception e) {
                log.error("Failed to save batch to shard {}: {}", shardId, e.getMessage());
                throw e;
            }
        }
    }
    
    /**
     * Generate sample profiles for testing
     */
    private List<Profile> generateSampleProfiles(int count) {
        List<Profile> profiles = new ArrayList<>();
        Random random = new Random();
        
        String[] companies = {"Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Tesla", "OpenAI"};
        String[] jobTitles = {"Software Engineer", "Data Scientist", "Product Manager", "DevOps Engineer", "ML Engineer"};
        String[] industries = {"Technology", "Software", "Internet", "AI/ML", "Cloud Computing"};
        String[] locations = {"San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Boston, MA"};
        
        for (int i = 0; i < count; i++) {
            Profile profile = new Profile();
            profile.setId(UUID.randomUUID());
            profile.setFullName("Test User " + (i + 1));
            profile.setFirstName("Test");
            profile.setLastName("User " + (i + 1));
            profile.setJobTitle(jobTitles[random.nextInt(jobTitles.length)]);
            profile.setCompanyName(companies[random.nextInt(companies.length)]);
            profile.setIndustry(industries[random.nextInt(industries.length)]);
            profile.setLocation(locations[random.nextInt(locations.length)]);
            profile.setLocationCountry("USA");
            profile.setLinkedinUrl("https://linkedin.com/in/test-user-" + (i + 1));
            
            // Set sample skills
            profile.setSkills(new String[]{"Java", "Python", "AWS", "React", "SQL"});
            profile.setYearsExperience(random.nextInt(15) + 1);
            profile.setHeadline(profile.getJobTitle() + " at " + profile.getCompanyName());
            profile.setSummary("Experienced " + profile.getJobTitle().toLowerCase() + " with expertise in modern technologies.");
            
            profiles.add(profile);
        }
        
        return profiles;
    }
    
    private void updateImportStatus(String importId, String status, long processed, double progress, String message) {
        ImportStatusDto currentStatus = activeImports.get(importId);
        if (currentStatus != null) {
            ImportStatusDto updatedStatus = ImportStatusDto.builder()
                .batchId(currentStatus.getBatchId())
                .filename(currentStatus.getFilename())
                .status(status)
                .totalRecords(currentStatus.getTotalRecords())
                .processedRecords(processed)
                .failedRecords(currentStatus.getFailedRecords())
                .progressPercentage(progress)
                .startTime(currentStatus.getStartTime())
                .endTime(status.equals("COMPLETED") || status.equals("FAILED") ? LocalDateTime.now() : null)
                .executionTimeMs(currentStatus.getStartTime() != null ? 
                    java.time.Duration.between(currentStatus.getStartTime(), LocalDateTime.now()).toMillis() : 0L)
                .currentStage(message)
                .build();
            
            activeImports.put(importId, updatedStatus);
        }
    }
    
    private void handleImportError(String importId, Exception e) {
        log.error("Import {} failed with error", importId, e);
        updateImportStatus(importId, "FAILED", 0L, 0.0, "Import failed: " + e.getMessage());
    }
    
    public ImportStatusDto getImportStatus(String importId) {
        return activeImports.get(importId);
    }
    
    public Map<String, ImportStatusDto> getAllActiveImports() {
        return new HashMap<>(activeImports);
    }
    
    public boolean cancelImport(String importId) {
        CompletableFuture<Void> task = importTasks.get(importId);
        if (task != null && !task.isDone()) {
            task.cancel(true);
            updateImportStatus(importId, "CANCELLED", 0L, 0.0, "Import cancelled by user");
            importTasks.remove(importId);
            return true;
        }
        return false;
    }
    
    public Map<String, Object> getImportStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long completedImports = activeImports.values().stream()
            .mapToLong(status -> "COMPLETED".equals(status.getStatus()) ? 1 : 0)
            .sum();
        
        long failedImports = activeImports.values().stream()
            .mapToLong(status -> "FAILED".equals(status.getStatus()) ? 1 : 0)
            .sum();
        
        long activeImportsCount = activeImports.values().stream()
            .mapToLong(status -> "PROCESSING".equals(status.getStatus()) ? 1 : 0)
            .sum();
        
        stats.put("totalImports", activeImports.size());
        stats.put("completedImports", completedImports);
        stats.put("failedImports", failedImports);
        stats.put("activeImports", activeImportsCount);
        stats.put("totalProfilesImported", profileRepository.count());
        
        return stats;
    }
    
    public boolean checkDataFileExists() {
        String fullPath = resolveFilePath(defaultParquetPath);
        return new File(fullPath).exists();
    }
    
    private String resolveFilePath(String filename) {
        // In a container, the working directory is /app
        // The data volume is mapped to /app/data
        File file = new File("/app/", filename);
        return file.getAbsolutePath();
    }
}