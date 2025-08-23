package com.semantictalent.finder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchImportResponse {
    private String batchId;
    private boolean success;
    private int processedCount;
    private int failedCount;
    private String errorMessage;
    private LocalDateTime processedAt;
}