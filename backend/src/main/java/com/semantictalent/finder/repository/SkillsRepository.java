package com.semantictalent.finder.repository;

import com.semantictalent.finder.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillsRepository extends JpaRepository<Skill, Long> {
    
    // Find skill by name
    Optional<Skill> findByName(String name);
    
    // Find skills by category
    List<Skill> findByCategory(Skill.SkillCategory category);
    
    // Find technical skills
    List<Skill> findByIsTechnicalTrue();
    
    // Find soft skills (non-technical)
    List<Skill> findByIsTechnicalFalse();
    
    // Find top skills by frequency
    @Query("SELECT s FROM Skill s ORDER BY s.frequency DESC")
    List<Skill> findTopSkillsByFrequency();
    
    // Find skills containing text
    @Query("SELECT s FROM Skill s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Skill> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    // Get skill statistics
    @Query("SELECT COUNT(s) FROM Skill s WHERE s.isTechnical = true")
    Long countTechnicalSkills();
    
    @Query("SELECT COUNT(s) FROM Skill s WHERE s.isTechnical = false")
    Long countSoftSkills();
    
    @Query("SELECT SUM(s.frequency) FROM Skill s")
    Long getTotalSkillFrequency();
    
    // Find skills with aliases
    @Query("SELECT s FROM Skill s WHERE s.aliases IS NOT NULL AND array_length(s.aliases, 1) > 0")
    List<Skill> findSkillsWithAliases();
}