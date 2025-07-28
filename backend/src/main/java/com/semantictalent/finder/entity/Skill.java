package com.semantictalent.finder.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "skills", indexes = {
    @Index(name = "idx_skills_name", columnList = "name", unique = true),
    @Index(name = "idx_skills_category", columnList = "category"),
    @Index(name = "idx_skills_frequency", columnList = "frequency")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", unique = true, nullable = false, length = 200)
    private String name;
    
    @Column(name = "normalized_name", length = 200)
    private String normalizedName;
    
    @Column(name = "category", length = 50)
    @Enumerated(EnumType.STRING)
    private SkillCategory category;
    
    @Column(name = "frequency")
    private Long frequency = 0L;
    
    @Column(name = "is_technical")
    private Boolean isTechnical = false;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "aliases", columnDefinition = "text[]")
    private String[] aliases;
    
    public enum SkillCategory {
        TECHNICAL, SOFT, LANGUAGE, CERTIFICATION, TOOL, FRAMEWORK, INDUSTRY
    }
}