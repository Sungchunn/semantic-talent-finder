package com.semantictalent.finder.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchImportRequest {
    private String batchId;
    private List<ProfileImportDto> profiles;
}