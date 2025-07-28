package com.semantictalent.finder.repository;

import com.semantictalent.finder.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.pgvector.PGvector;
import java.util.List;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {
    
    @Query(value = "SELECT *, (1 - (embedding <=> ?1)) as similarity_score " +
           "FROM profiles " +
           "WHERE (1 - (embedding <=> ?1)) > ?2 " +
           "ORDER BY embedding <=> ?1 " +
           "LIMIT ?3", nativeQuery = true)
    List<Profile> findSimilarProfiles(PGvector queryEmbedding, Double threshold, Integer limit);
    
    @Query("SELECT p FROM Profile p WHERE p.industry IN :industries")
    List<Profile> findByIndustries(@Param("industries") List<String> industries);
    
    @Query("SELECT p FROM Profile p WHERE p.location IN :locations")
    List<Profile> findByLocations(@Param("locations") List<String> locations);
    
    @Query("SELECT p FROM Profile p WHERE p.experienceLevel = :experienceLevel")
    List<Profile> findByExperienceLevel(@Param("experienceLevel") String experienceLevel);
    
    @Query("SELECT COUNT(p) FROM Profile p")
    Long countTotalProfiles();
    
    @Query("SELECT DISTINCT p.industry FROM Profile p WHERE p.industry IS NOT NULL ORDER BY p.industry")
    List<String> findDistinctIndustries();
    
    @Query("SELECT DISTINCT p.location FROM Profile p WHERE p.location IS NOT NULL ORDER BY p.location")
    List<String> findDistinctLocations();
    
    @Query("SELECT DISTINCT p.experienceLevel FROM Profile p WHERE p.experienceLevel IS NOT NULL ORDER BY p.experienceLevel")
    List<String> findDistinctExperienceLevels();
}