package com.semantictalent.finder.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportStatusDto {
    private String batchId;
    private String filename;
    private String status;              // PROCESSING, COMPLETED, FAILED
    private Long totalRecords;
    private Long processedRecords;
    private Long failedRecords;
    private Double progressPercentage;
    private String errorMessage;
    private Long executionTimeMs;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String currentStage;
}