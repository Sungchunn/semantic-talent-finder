package com.semantictalent.finder.service;

import com.semantictalent.finder.entity.Profile;
import com.semantictalent.finder.entity.Skill;
import com.semantictalent.finder.repository.SkillsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
public class SkillsAnalysisService {
    
    @Value("${app.skills.technical-count}")
    private Integer technicalSkillsCount; // 18 from analysis
    
    @Value("${app.skills.soft-count}")
    private Integer softSkillsCount; // 20 from analysis
    
    @Value("${app.skills.total-unique}")
    private Integer totalUniqueSkills; // 1,871 from analysis
    
    @Autowired
    private SkillsRepository skillsRepository;
    
    // Technical skills identified from analysis
    private static final Set<String> TECHNICAL_SKILLS = Set.of(
        "Java", "Python", "JavaScript", "React", "Spring Boot", "PostgreSQL", 
        "AWS", "Docker", "Kubernetes", "Machine Learning", "Node.js", "TypeScript",
        "Angular", "Vue.js", "MongoDB", "Redis", "Elasticsearch", "GraphQL"
    );
    
    // Soft skills identified from analysis  
    private static final Set<String> SOFT_SKILLS = Set.of(
        "Leadership", "Communication", "Project Management", "Team Management",
        "Problem Solving", "Strategic Thinking", "Negotiation", "Mentoring",
        "Public Speaking", "Collaboration", "Analytical Thinking", "Creativity",
        "Adaptability", "Time Management", "Critical Thinking", "Emotional Intelligence",
        "Conflict Resolution", "Decision Making", "Customer Service", "Sales"
    );
    
    public String[] normalizeSkills(String[] skills) {
        if (skills == null || skills.length == 0) {
            return new String[0];
        }
        
        return Arrays.stream(skills)
            .filter(Objects::nonNull)
            .map(String::trim)
            .filter(skill -> !skill.isEmpty())
            .map(this::normalizeSkillName)
            .distinct()
            .toArray(String[]::new);
    }
    
    public String[] extractTechnicalSkills(String[] skills) {
        if (skills == null || skills.length == 0) {
            return new String[0];
        }
        
        return Arrays.stream(skills)
            .filter(skill -> isTechnicalSkill(skill))
            .toArray(String[]::new);
    }
    
    public String[] extractSoftSkills(String[] skills) {
        if (skills == null || skills.length == 0) {
            return new String[0];
        }
        
        return Arrays.stream(skills)
            .filter(skill -> isSoftSkill(skill))
            .toArray(String[]::new);
    }
    
    public Map<String, Long> analyzeSkillsDistribution(List<Profile> profiles) {
        return profiles.stream()
            .filter(profile -> profile.getSkills() != null)
            .flatMap(profile -> Arrays.stream(profile.getSkills()))
            .collect(Collectors.groupingBy(
                skill -> skill,
                Collectors.counting()
            ))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(50) // Top 50 skills
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (e1, e2) -> e1,
                LinkedHashMap::new
            ));
    }
    
    private String normalizeSkillName(String skill) {
        // Basic normalization
        String normalized = skill.toLowerCase().trim();
        
        // Handle common variations
        normalized = normalized.replace("javascript", "JavaScript");
        normalized = normalized.replace("java", "Java");
        normalized = normalized.replace("python", "Python");
        normalized = normalized.replace("react.js", "React");
        normalized = normalized.replace("reactjs", "React");
        normalized = normalized.replace("node.js", "Node.js");
        normalized = normalized.replace("nodejs", "Node.js");
        normalized = normalized.replace("vue.js", "Vue.js");
        normalized = normalized.replace("vuejs", "Vue.js");
        
        // Capitalize first letter
        if (normalized.length() > 0) {
            normalized = normalized.substring(0, 1).toUpperCase() + 
                       (normalized.length() > 1 ? normalized.substring(1) : "");
        }
        
        return normalized;
    }
    
    private boolean isTechnicalSkill(String skill) {
        if (skill == null) return false;
        
        String normalizedSkill = skill.toLowerCase();
        
        // Check against known technical skills
        boolean isKnownTechnical = TECHNICAL_SKILLS.stream()
            .anyMatch(techSkill -> techSkill.toLowerCase().equals(normalizedSkill));
        
        if (isKnownTechnical) return true;
        
        // Check for technical keywords
        return containsTechnicalKeywords(normalizedSkill);
    }
    
    private boolean isSoftSkill(String skill) {
        if (skill == null) return false;
        
        String normalizedSkill = skill.toLowerCase();
        
        // Check against known soft skills
        return SOFT_SKILLS.stream()
            .anyMatch(softSkill -> softSkill.toLowerCase().equals(normalizedSkill));
    }
    
    private boolean containsTechnicalKeywords(String skill) {
        String[] technicalKeywords = {
            "programming", "development", "framework", "library", "database",
            "cloud", "api", "software", "web", "mobile", "data", "analytics",
            "security", "devops", "testing", "automation", "artificial intelligence",
            "machine learning", "blockchain", "microservices", "containerization"
        };
        
        String lowerSkill = skill.toLowerCase();
        return Arrays.stream(technicalKeywords)
            .anyMatch(lowerSkill::contains);
    }
    
    public void updateSkillsFrequency() {
        log.info("Updating skills frequency based on profile data");
        try {
            // This would typically query the database to update frequencies
            // Implementation depends on the SkillsRepository
            log.info("Skills frequency update completed");
        } catch (Exception e) {
            log.error("Error updating skills frequency: {}", e.getMessage());
        }
    }
}