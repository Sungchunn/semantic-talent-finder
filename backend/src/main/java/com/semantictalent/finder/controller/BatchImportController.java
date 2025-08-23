package com.semantictalent.finder.controller;

import com.semantictalent.finder.dto.BatchImportRequest;
import com.semantictalent.finder.dto.BatchImportResponse;
import com.semantictalent.finder.service.BatchImportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Slf4j
public class BatchImportController {

    @Autowired
    private BatchImportService batchImportService;

    @PostMapping("/batch")
    public ResponseEntity<BatchImportResponse> importBatch(@RequestBody BatchImportRequest request) {
        log.info("Starting batch import for batch: {}", request.getBatchId());
        
        try {
            BatchImportResponse response = batchImportService.processBatch(request);
            log.info("Batch import completed for {}: {} profiles processed", 
                     request.getBatchId(), response.getProcessedCount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Batch import failed for {}", request.getBatchId(), e);
            return ResponseEntity.badRequest()
                .body(BatchImportResponse.builder()
                    .batchId(request.getBatchId())
                    .success(false)
                    .errorMessage(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/batch/{batchId}/status")
    public ResponseEntity<BatchImportResponse> getBatchStatus(@PathVariable String batchId) {
        log.debug("Getting batch status for: {}", batchId);
        
        try {
            BatchImportResponse status = batchImportService.getBatchStatus(batchId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Failed to get batch status for {}", batchId, e);
            return ResponseEntity.notFound().build();
        }
    }
}