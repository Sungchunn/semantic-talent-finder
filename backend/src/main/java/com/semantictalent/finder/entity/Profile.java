package com.semantictalent.finder.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.pgvector.PGvector;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "profiles", indexes = {
    @Index(name = "idx_profiles_industry", columnList = "industry"),
    @Index(name = "idx_profiles_location_country", columnList = "location_country"),
    @Index(name = "idx_profiles_experience_level", columnList = "experience_level"),
    @Index(name = "idx_profiles_data_quality", columnList = "data_quality_score"),
    @Index(name = "idx_profiles_full_text", columnList = "searchable_content")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;
    
    // High-quality fields (0-3% null - based on dataset analysis)
    @Column(name = "full_name", nullable = false, length = 500)
    private String fullName;
    
    @Column(name = "first_name", length = 250)
    private String firstName;
    
    @Column(name = "last_name", length = 250)
    private String lastName;
    
    @Column(name = "location", length = 200)
    private String location;
    
    @Column(name = "locality", length = 150)
    private String locality;
    
    @Column(name = "region", length = 150)
    private String region;
    
    @Column(name = "location_country", length = 100)
    private String locationCountry;
    
    @Column(name = "location_continent", length = 50)
    private String locationContinent;
    
    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;
    
    @Column(name = "linkedin_username", length = 100)
    private String linkedinUsername;
    
    // Medium-quality fields (11-19% null - based on dataset analysis)
    @Column(name = "industry", length = 200)
    private String industry;
    
    @Column(name = "job_title", length = 300)
    private String jobTitle;
    
    @Column(name = "metro", length = 200)
    private String metro;
    
    @Column(name = "gender", length = 20)
    private String gender;
    
    @Column(name = "last_updated")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdated;
    
    // Additional processed fields
    @Column(name = "headline", length = 500)
    private String headline;
    
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;
    
    @Column(name = "experience_level", length = 50)
    private String experienceLevel;
    
    @Column(name = "years_experience")
    private Integer yearsExperience;
    
    @Column(name = "company_name", length = 300)
    private String companyName;
    
    // Skills arrays (normalized from 1,871 unique skills)
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "skills", columnDefinition = "text[]")
    private String[] skills;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "technical_skills", columnDefinition = "text[]")
    private String[] technicalSkills;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "soft_skills", columnDefinition = "text[]")
    private String[] softSkills;
    
    // Searchable content for embeddings
    @Column(name = "searchable_content", columnDefinition = "TEXT")
    private String searchableContent;
    
    // Vector embedding (1536 dimensions - OpenAI text-embedding-3-small)
    @Column(name = "embedding", columnDefinition = "vector(1536)")
    private PGvector embedding;
    
    // Data quality metrics (based on analysis)
    @Column(name = "data_quality_score")
    private Double dataQualityScore;
    
    @Column(name = "completeness_score")
    private Double completenessScore;
    
    // Metadata
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    @Column(name = "import_batch_id")
    private String importBatchId;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}