
# Semantic Talent Finder - Claude Code Development Guide

## 🚨 IMPORTANT: Project Scope & Access Restrictions

**Claude Code is RESTRICTED to working within this project directory ONLY:**
```
/Users/chromatrical/CAREER/Side Projects/semantic-talent-finder
```

**⛔ DO NOT ACCESS FILES OUTSIDE THIS DIRECTORY**
- No system files access
- No other project directories
- No user home directory files outside this project
- Only work within the semantic-talent-finder project scope

**🚫 CRITICAL: You will NEVER force push any code**
- Always use regular `git push` commands
- Never use `git push --force` or `git push -f`
- Respect the existing commit history

---

## 🎯 Project Overview

**Semantic Talent Finder** is an AI-powered semantic search engine for professional profiles that replaces traditional checkbox filters with natural language queries.

**Tech Stack:**
- Backend: Spring Boot 3.4.8 + Java 21 + PostgreSQL + pgvector
- Frontend: React + React Bits + Tailwind CSS
- AI: Spring AI + OpenAI Embeddings
- Database: PostgreSQL with vector extensions

**Project Goals:**
- Enable natural language search: "Find senior Java developers in fintech with startup experience"
- Process 100M+ LinkedIn profiles dataset
- Demonstrate modern AI search capabilities
- Learning project for AI integration patterns

---

## 📁 Project Structure

```
/Users/chromatrical/CAREER/Side Projects/semantic-talent-finder/
├── README.md                          # Project documentation
├── claude.md                          # This file - Claude Code guide
├── docker-compose.yml                 # Development environment
├── .gitignore                         # Git ignore rules
├── backend/                           # Spring Boot Application
│   ├── pom.xml                       # Maven configuration
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/semantictalent/finder/
│   │   │   │   ├── SemanticTalentFinderApplication.java
│   │   │   │   ├── controller/       # REST API Controllers
│   │   │   │   │   ├── SearchController.java
│   │   │   │   │   ├── ProfileController.java
│   │   │   │   │   └── HealthController.java
│   │   │   │   ├── service/          # Business Logic
│   │   │   │   │   ├── SearchService.java
│   │   │   │   │   ├── EmbeddingService.java
│   │   │   │   │   ├── ProfileService.java
│   │   │   │   │   └── SemanticSearchService.java
│   │   │   │   ├── repository/       # Data Access Layer
│   │   │   │   │   ├── ProfileRepository.java
│   │   │   │   │   └── SearchQueryRepository.java
│   │   │   │   ├── entity/           # JPA Entities
│   │   │   │   │   ├── Profile.java
│   │   │   │   │   └── SearchQuery.java
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   │   ├── SearchRequestDto.java
│   │   │   │   │   ├── SearchResultDto.java
│   │   │   │   │   ├── ProfileDto.java
│   │   │   │   │   └── ProfileSummaryDto.java
│   │   │   │   ├── config/           # Configuration Classes
│   │   │   │   │   ├── OpenAIConfig.java
│   │   │   │   │   ├── DatabaseConfig.java
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   └── util/             # Utility Classes
│   │   │   │       ├── EmbeddingUtils.java
│   │   │   │       ├── VectorUtils.java
│   │   │   │       └── DataImportUtils.java
│   │   │   └── resources/
│   │   │       ├── application.yml   # Main configuration
│   │   │       ├── application-dev.yml
│   │   │       ├── application-prod.yml
│   │   │       ├── data.sql          # Sample data
│   │   │       └── schema.sql        # Database schema
│   │   └── test/
│   │       └── java/com/semantictalent/finder/
│   │           ├── controller/       # Controller tests
│   │           ├── service/          # Service tests
│   │           ├── repository/       # Repository tests
│   │           └── integration/      # Integration tests
├── frontend/                          # React Application
│   ├── package.json                  # NPM dependencies
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   └── src/
│       ├── App.js                    # Main App component
│       ├── index.js                  # Entry point
│       ├── index.css                 # Global styles
│       ├── components/               # Reusable components
│       │   ├── common/
│       │   │   ├── Header.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── Layout.jsx
│       │   │   └── LoadingSpinner.jsx
│       │   ├── search/
│       │   │   ├── SearchBar.jsx
│       │   │   ├── SearchResults.jsx
│       │   │   ├── SearchFilters.jsx
│       │   │   └── SearchSuggestions.jsx
│       │   ├── profile/
│       │   │   ├── ProfileCard.jsx
│       │   │   ├── ProfileDetail.jsx
│       │   │   └── ProfileSummary.jsx
│       │   └── reactbits/            # React Bits components
│       │       ├── SplitText.jsx
│       │       ├── FadeInUp.jsx
│       │       └── AnimatedButton.jsx
│       ├── pages/                    # Page components
│       │   ├── HomePage.jsx
│       │   ├── SearchPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── AboutPage.jsx
│       ├── hooks/                    # Custom React hooks
│       │   ├── useSearch.js
│       │   ├── useDebounce.js
│       │   └── useApi.js
│       ├── services/                 # API service functions
│       │   ├── api.js
│       │   ├── searchService.js
│       │   └── profileService.js
│       └── utils/                    # Utility functions
│           ├── constants.js
│           ├── formatters.js
│           └── validators.js
└── data/                             # Data files (development only)
    ├── sample-profiles.json
    ├── linkedin-100m.parquet        # Large dataset (gitignored)
    └── import-scripts/
        ├── parquet-processor.py
        └── embedding-generator.py
```

---

## 🛠️ Spring Boot Configuration

### Application Structure
```java
// Main Application Class
package com.semantictalent.finder;

@SpringBootApplication
@EnableJpaRepositories
public class SemanticTalentFinderApplication {
    public static void main(String[] args) {
        SpringApplication.run(SemanticTalentFinderApplication.class, args);
    }
}
```

### Configuration Files

#### `application.yml`
```yaml
spring:
  application:
    name: semantic-talent-finder
  
  datasource:
    url: jdbc:postgresql://localhost:5432/semantic_talent_finder
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: create-drop
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: true
  
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-3.5-turbo
      embedding:
        options:
          model: text-embedding-3-small
  
  security:
    oauth2:
      client:
        registration:
          github:
            client-id: ${GITHUB_CLIENT_ID:}
            client-secret: ${GITHUB_CLIENT_SECRET:}

server:
  port: 8080
  
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always

logging:
  level:
    com.semantictalent.finder: DEBUG
    org.springframework.ai: DEBUG
    org.hibernate.SQL: DEBUG
```

---

## 📊 Core Data Models

### Profile Entity
```java
package com.semantictalent.finder.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.pgvector.PGvector;

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
```

### Search Request/Response DTOs
```java
package com.semantictalent.finder.dto;

import lombok.Data;
import java.util.List;

@Data
public class SearchRequestDto {
    private String query;               // "Senior Java developers in fintech"
    private Integer limit = 10;         // Number of results
    private Double threshold = 0.7;     // Similarity threshold
    private List<String> industries;    // Optional filters
    private List<String> locations;     // Optional filters
    private String experienceLevel;     // Optional filter
}

@Data
public class SearchResultDto {
    private List<ProfileSummaryDto> profiles;
    private Integer totalResults;
    private Double executionTimeMs;
    private String processedQuery;
    private List<String> suggestions;
}

@Data
public class ProfileSummaryDto {
    private String id;
    private String fullName;
    private String headline;
    private String location;
    private String industry;
    private String companyName;
    private String jobTitle;
    private Double similarityScore;
    private List<String> matchingSkills;
}
```

---

## 🔍 Core Business Logic

### Search Service Implementation
```java
package com.semantictalent.finder.service;

@Service
@Slf4j
public class SemanticSearchService {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    public SearchResultDto searchProfiles(SearchRequestDto request) {
        // 1. Generate embedding for search query
        PGvector queryEmbedding = embeddingService.generateEmbedding(request.getQuery());
        
        // 2. Perform vector similarity search
        List<Profile> similarProfiles = profileRepository.findSimilarProfiles(
            queryEmbedding, 
            request.getThreshold(), 
            request.getLimit()
        );
        
        // 3. Convert to DTOs with similarity scores
        List<ProfileSummaryDto> results = similarProfiles.stream()
            .map(this::convertToSummaryDto)
            .collect(Collectors.toList());
        
        // 4. Build response
        SearchResultDto response = new SearchResultDto();
        response.setProfiles(results);
        response.setTotalResults(results.size());
        response.setProcessedQuery(request.getQuery());
        
        return response;
    }
    
    private ProfileSummaryDto convertToSummaryDto(Profile profile) {
        // Conversion logic with similarity score calculation
    }
}
```

### Profile Repository with Vector Search
```java
package com.semantictalent.finder.repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {
    
    @Query(value = """
        SELECT *, (1 - (embedding <=> ?1)) as similarity_score 
        FROM profiles 
        WHERE (1 - (embedding <=> ?1)) > ?2 
        ORDER BY embedding <=> ?1 
        LIMIT ?3
        """, nativeQuery = true)
    List<Profile> findSimilarProfiles(PGvector queryEmbedding, Double threshold, Integer limit);
    
    @Query("SELECT p FROM Profile p WHERE p.industry IN :industries")
    List<Profile> findByIndustries(@Param("industries") List<String> industries);
    
    @Query("SELECT p FROM Profile p WHERE p.location IN :locations")
    List<Profile> findByLocations(@Param("locations") List<String> locations);
    
    @Query("SELECT COUNT(p) FROM Profile p")
    Long countTotalProfiles();
}
```

---

## 🌐 REST API Endpoints

### Search Controller
```java
package com.semantictalent.finder.controller;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class SearchController {
    
    @Autowired
    private SemanticSearchService searchService;
    
    @PostMapping("/semantic")
    public ResponseEntity<SearchResultDto> semanticSearch(
            @Valid @RequestBody SearchRequestDto request) {
        
        log.info("Received semantic search request: {}", request.getQuery());
        
        try {
            SearchResultDto results = searchService.searchProfiles(request);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Error processing search request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSearchSuggestions(
            @RequestParam String query) {
        
        List<String> suggestions = searchService.generateSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
    
    @GetMapping("/filters")
    public ResponseEntity<Map<String, List<String>>> getAvailableFilters() {
        Map<String, List<String>> filters = searchService.getAvailableFilters();
        return ResponseEntity.ok(filters);
    }
}
```

### Profile Controller
```java
package com.semantictalent.finder.controller;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable String id) {
        ProfileDto profile = profileService.getProfileById(id);
        return ResponseEntity.ok(profile);
    }
    
    @PostMapping("/batch-import")
    public ResponseEntity<String> importProfiles(@RequestParam MultipartFile file) {
        // Handle large file import
        profileService.processBatchImport(file);
        return ResponseEntity.ok("Import started successfully");
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = profileService.getProfileStats();
        return ResponseEntity.ok(stats);
    }
}
```

---

## ⚛️ Frontend React Components

### Main Search Component
```jsx
// frontend/src/components/search/SearchBar.jsx
import React, { useState, useCallback } from 'react';
import { SplitText } from '../reactbits/SplitText';
import { useDebounce } from '../../hooks/useDebounce';
import { searchService } from '../../services/searchService';

const SearchBar = ({ onSearch, loading }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const debouncedQuery = useDebounce(query, 300);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch({ query: query.trim(), limit: 20 });
        }
    }, [query, onSearch]);

    const fetchSuggestions = useCallback(async (searchQuery) => {
        if (searchQuery.length > 2) {
            try {
                const suggestions = await searchService.getSuggestions(searchQuery);
                setSuggestions(suggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }
    }, []);

    React.useEffect(() => {
        fetchSuggestions(debouncedQuery);
    }, [debouncedQuery, fetchSuggestions]);

    return (
        <div className="search-container max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <SplitText 
                    text="Find the perfect talent with AI"
                    className="text-4xl font-bold text-gray-800 mb-4"
                    delay={100}
                />
                <p className="text-xl text-gray-600">
                    Search 100M+ professional profiles using natural language
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., Senior Java developers in fintech with startup experience"
                        className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="absolute right-2 top-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                
                {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setQuery(suggestion)}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

export default SearchBar;
```

### Search Results Component
```jsx
// frontend/src/components/search/SearchResults.jsx
import React from 'react';
import ProfileCard from '../profile/ProfileCard';
import { FadeInUp } from '../reactbits/FadeInUp';

const SearchResults = ({ results, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!results || results.profiles.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-gray-600">No profiles found matching your search.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search terms or filters.</p>
            </div>
        );
    }

    return (
        <div className="search-results">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                    Found {results.totalResults} profiles
                </h3>
                <p className="text-gray-600">
                    Search completed in {results.executionTimeMs}ms
                </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.profiles.map((profile, index) => (
                    <FadeInUp key={profile.id} delay={index * 100}>
                        <ProfileCard profile={profile} />
                    </FadeInUp>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
```

---

## 🗄️ Database Schema

### PostgreSQL Setup with pgvector
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(500) NOT NULL,
    headline VARCHAR(500),
    summary TEXT,
    location VARCHAR(200),
    industry VARCHAR(200),
    experience_level VARCHAR(50),
    skills TEXT[],
    company_name VARCHAR(300),
    job_title VARCHAR(300),
    years_experience INTEGER,
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vector similarity index using HNSW
CREATE INDEX ON profiles USING hnsw (embedding vector_cosine_ops);

-- Additional indexes for filtering
CREATE INDEX idx_profiles_industry ON profiles(industry);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_experience_level ON profiles(experience_level);

-- Search queries table for analytics
CREATE TABLE search_queries (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    user_ip VARCHAR(45),
    results_count INTEGER,
    execution_time_ms INTEGER,
    filters_applied JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data insertion
INSERT INTO profiles (full_name, headline, summary, location, industry, skills, embedding) 
VALUES 
('John Smith', 'Senior Java Developer', 'Experienced backend developer with 8 years in fintech', 'New York, NY', 'Financial Services', 
 ARRAY['Java', 'Spring Boot', 'PostgreSQL', 'AWS'], 
 '[0.1, 0.2, 0.3, ...]'::vector),
('Sarah Johnson', 'Full Stack Engineer', 'React and Node.js specialist with startup experience', 'San Francisco, CA', 'Technology',
 ARRAY['React', 'Node.js', 'TypeScript', 'MongoDB'],
 '[0.2, 0.1, 0.4, ...]'::vector);
```

---

## 🔧 Development Commands & Scripts

### Backend Development
```bash
# Navigate to project directory
cd "/Users/chromatrical/CAREER/Side Projects/semantic-talent-finder"

# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run Spring Boot application
cd backend
./mvnw spring-boot:run

# Run tests
./mvnw test

# Package application
./mvnw clean package

# Generate embeddings for existing data
./mvnw exec:java -Dexec.mainClass="com.semantictalent.finder.util.EmbeddingGenerator"
```

### Frontend Development
```bash
# Setup React application
cd frontend
npm install

# Install React Bits components
npx jsrepo add https://reactbits.dev/default/TextAnimations/SplitText
npx jsrepo add https://reactbits.dev/default/Animations/FadeInUp

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Docker Development Environment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Reset database
docker-compose down -v && docker-compose up -d postgres
```

---

## 🧪 Testing Strategy

### Backend Testing
```java
// Integration test example
@SpringBootTest
@Testcontainers
class SemanticSearchServiceIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("pgvector/pgvector:pg16")
            .withDatabaseName("test_db")
            .withUsername("test")
            .withPassword("test");
    
    @Test
    void testSemanticSearch() {
        // Test semantic search functionality
        SearchRequestDto request = new SearchRequestDto();
        request.setQuery("Java developer");
        request.setLimit(5);
        
        SearchResultDto results = searchService.searchProfiles(request);
        
        assertThat(results.getProfiles()).isNotEmpty();
        assertThat(results.getProfiles().get(0).getSimilarityScore()).isGreaterThan(0.7);
    }
}
```

### Frontend Testing
```javascript
// React component test
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/search/SearchBar';

describe('SearchBar Component', () => {
    test('handles search submission correctly', () => {
        const mockOnSearch = jest.fn();
        render(<SearchBar onSearch={mockOnSearch} loading={false} />);
        
        const input = screen.getByPlaceholderText(/Senior Java developers/);
        const button = screen.getByText('Search');
        
        fireEvent.change(input, { target: { value: 'React developers' } });
        fireEvent.click(button);
        
        expect(mockOnSearch).toHaveBeenCalledWith({
            query: 'React developers',
            limit: 20
        });
    });
});
```

---

## 🚀 Deployment & Production

### Environment Configuration
```yaml
# application-prod.yml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}

logging:
  level:
    com.semantictalent.finder: INFO
    org.springframework.ai: WARN
```

### Docker Production Setup
```dockerfile
# backend/Dockerfile
FROM openjdk:21-jdk-slim
COPY target/semantic-talent-finder-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

---

## 📊 Performance Optimization

### Database Optimization
- Use HNSW index for vector similarity search
- Implement connection pooling with HikariCP
- Add proper indexes for filtering columns
- Use pagination for large result sets

### API Optimization
- Implement request/response compression
- Add caching for frequent searches
- Use async processing for embedding generation
- Implement rate limiting

### Frontend Optimization
- Lazy load React Bits animations
- Implement virtual scrolling for large result lists
- Use React.memo for expensive components
- Optimize bundle size with code splitting

---

## 🐛 Troubleshooting Guide

### Common Backend Issues
- **PostgreSQL Connection**: Ensure Docker container is running
- **Vector Extension**: Verify pgvector extension is installed
- **OpenAI API**: Check API key and rate limits
- **Embedding Generation**: Monitor memory usage for large batches

### Common Frontend Issues
- **React Bits Components**: Ensure proper installation with jsrepo
- **API Calls**: Check CORS configuration
- **Build Issues**: Clear node_modules and reinstall dependencies

---

## 📚 Development Resources

### Spring AI Documentation
- [Spring AI Reference](https://docs.spring.io/spring-ai/reference/)
- [OpenAI Integration](https://docs.spring.io/spring-ai/reference/api/embeddings/openai-embeddings.html)

### PostgreSQL Vector Resources
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Vector Similarity Search](https://www.postgresql.org/docs/current/indexes-types.html)

### React Bits Resources
- [React Bits Documentation](https://reactbits.dev)
- [Component Gallery](https://reactbits.dev/components)

---

## ⚠️ Security Considerations

- Store OpenAI API key in environment variables
- Implement rate limiting for API endpoints
- Validate all user inputs
- Use HTTPS in production
- Implement proper CORS configuration
- Add authentication for admin endpoints

---

## 🎯 Success Metrics

- Search response time < 500ms
- 95% uptime
- Support for 100M+ profiles
- User engagement metrics
- Search accuracy > 85%

---

**Remember: This is a learning project focused on demonstrating modern AI search capabilities. Prioritize clean, well-documented code and proper architecture patterns.**