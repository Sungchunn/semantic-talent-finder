package com.semantictalent.finder.entity;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.pgvector.PGvector;
import java.util.Date;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "full_name", nullable = false, length = 500)
    private String fullName;
    
    @Column(name = "headline", length = 500)
    private String headline;
    
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;
    
    @Column(name = "location", length = 200)
    private String location;
    
    @Column(name = "industry", length = 200)
    private String industry;
    
    @Column(name = "experience_level", length = 50)
    private String experienceLevel;
    
    @Column(name = "skills", columnDefinition = "TEXT[]")
    private String[] skills;
    
    @Column(name = "company_name", length = 300)
    private String companyName;
    
    @Column(name = "job_title", length = 300)
    private String jobTitle;
    
    @Column(name = "years_experience")
    private Integer yearsExperience;
    
    @Column(name = "embedding", columnDefinition = "vector(1536)")
    private PGvector embedding;
    
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
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