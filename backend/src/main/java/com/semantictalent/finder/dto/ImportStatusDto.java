package com.semantictalent.finder.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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
    private String startedAt;
    private String completedAt;
}