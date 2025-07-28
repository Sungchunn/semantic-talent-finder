package com.semantictalent.finder.repository;

import com.semantictalent.finder.entity.SearchQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface SearchQueryRepository extends JpaRepository<SearchQuery, Long> {
    
    @Query("SELECT sq FROM SearchQuery sq WHERE sq.createdAt BETWEEN :startDate AND :endDate ORDER BY sq.createdAt DESC")
    List<SearchQuery> findByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    @Query("SELECT sq FROM SearchQuery sq WHERE sq.userIp = :userIp ORDER BY sq.createdAt DESC")
    List<SearchQuery> findByUserIp(@Param("userIp") String userIp);
    
    @Query("SELECT sq.queryText, COUNT(sq) as searchCount FROM SearchQuery sq GROUP BY sq.queryText ORDER BY searchCount DESC")
    List<Object[]> findPopularQueries();
    
    @Query("SELECT AVG(sq.executionTimeMs) FROM SearchQuery sq WHERE sq.createdAt >= :date")
    Double findAverageExecutionTimeAfter(@Param("date") Date date);
}