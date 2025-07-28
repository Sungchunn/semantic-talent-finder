package com.semantictalent.finder.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "search_queries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchQuery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "query_text", nullable = false, columnDefinition = "TEXT")
    private String queryText;
    
    @Column(name = "user_ip", length = 45)
    private String userIp;
    
    @Column(name = "results_count")
    private Integer resultsCount;
    
    @Column(name = "execution_time_ms")
    private Integer executionTimeMs;
    
    @Column(name = "filters_applied", columnDefinition = "JSONB")
    private String filtersApplied;
    
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }
}