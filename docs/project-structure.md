# Project Structure

## 📁 Complete Directory Structure

```
/Users/chromatrical/CAREER/Side Projects/semantic-talent-finder/
├── README.md                          # Project documentation
├── CLAUDE.md                          # Main Claude Code guide
├── docker-compose.yml                 # Development environment
├── .gitignore                         # Git ignore rules
├── docs/                              # Organized documentation
│   ├── README.md                      # Documentation index
│   ├── project-overview.md            # Project goals and tech stack
│   ├── security-guidelines.md         # Security and git workflow
│   ├── project-structure.md           # This file
│   ├── backend/                       # Backend documentation
│   ├── frontend/                      # Frontend documentation
│   ├── database/                      # Database documentation
│   ├── data-processing/               # Data processing documentation
│   ├── deployment/                    # Deployment documentation
│   ├── monitoring/                    # Monitoring documentation
│   ├── testing/                       # Testing documentation
│   ├── known-issues.md                # Known issues and fixes
│   ├── roadmap.md                     # Development roadmap
│   └── metrics.md                     # Success metrics and KPIs
├── backend/                           # Spring Boot Application
│   ├── pom.xml                       # Maven configuration
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/semantictalent/finder/
│   │   │   │   ├── SemanticTalentFinderApplication.java
│   │   │   │   ├── controller/       # REST API Controllers
│   │   │   │   │   ├── SearchController.java
│   │   │   │   │   ├── ProfileController.java
│   │   │   │   │   ├── HealthController.java
│   │   │   │   │   └── DataImportController.java
│   │   │   │   ├── service/          # Business Logic
│   │   │   │   │   ├── SearchService.java
│   │   │   │   │   ├── EmbeddingService.java
│   │   │   │   │   ├── ProfileService.java
│   │   │   │   │   ├── SemanticSearchService.java
│   │   │   │   │   ├── DataImportService.java
│   │   │   │   │   └── SkillsAnalysisService.java
│   │   │   │   ├── repository/       # Data Access Layer
│   │   │   │   │   ├── ProfileRepository.java
│   │   │   │   │   ├── SearchQueryRepository.java
│   │   │   │   │   └── SkillsRepository.java
│   │   │   │   ├── entity/           # JPA Entities
│   │   │   │   │   ├── Profile.java
│   │   │   │   │   ├── SearchQuery.java
│   │   │   │   │   └── Skill.java
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   │   ├── SearchRequestDto.java
│   │   │   │   │   ├── SearchResultDto.java
│   │   │   │   │   ├── ProfileDto.java
│   │   │   │   │   ├── ProfileSummaryDto.java
│   │   │   │   │   └── ImportStatusDto.java
│   │   │   │   ├── config/           # Configuration Classes
│   │   │   │   │   ├── OpenAIConfig.java
│   │   │   │   │   ├── DatabaseConfig.java
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── BatchProcessingConfig.java
│   │   │   │   └── util/             # Utility Classes
│   │   │   │       ├── EmbeddingUtils.java
│   │   │   │       ├── VectorUtils.java
│   │   │   │       ├── DataImportUtils.java
│   │   │   │       └── SkillsNormalizationUtils.java
│   │   │   └── resources/
│   │   │       ├── application.yml   # Main configuration
│   │   │       ├── application-dev.yml
│   │   │       ├── application-prod.yml
│   │   │       ├── data.sql          # Sample data
│   │   │       └── schema.sql        # Production database schema
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
│       │   │   ├── SearchSuggestions.jsx
│       │   │   └── AdvancedSearch.jsx
│       │   ├── profile/
│       │   │   ├── ProfileCard.jsx
│       │   │   ├── ProfileDetail.jsx
│       │   │   ├── ProfileSummary.jsx
│       │   │   └── SkillsVisualization.jsx
│       │   ├── analytics/
│       │   │   ├── SearchMetrics.jsx
│       │   │   └── DataQualityDashboard.jsx
│       │   └── reactbits/            # React Bits components
│       │       ├── SplitText.jsx
│       │       ├── FadeInUp.jsx
│       │       └── AnimatedButton.jsx
│       ├── pages/                    # Page components
│       │   ├── HomePage.jsx
│       │   ├── SearchPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── AboutPage.jsx
│       │   └── AnalyticsPage.jsx
│       ├── hooks/                    # Custom React hooks
│       │   ├── useSearch.js
│       │   ├── useDebounce.js
│       │   ├── useApi.js
│       │   └── useDataImport.js
│       ├── services/                 # API service functions
│       │   ├── api.js
│       │   ├── searchService.js
│       │   ├── profileService.js
│       │   └── importService.js
│       └── utils/                    # Utility functions
│           ├── constants.js
│           ├── formatters.js
│           ├── validators.js
│           └── skillsUtils.js
└── data/                             # Data files and analysis
    ├── analysis_output/              # Generated analysis files
    │   ├── enhanced_linkedin_analysis.json
    │   ├── semantic_talent_finder_schema.sql
    │   └── data_processing_guide.json
    ├── sample-profiles.json
    ├── linkedin-100m.parquet        # Large dataset (gitignored)
    └── import-scripts/
        ├── parquet-processor.py
        ├── embedding-generator.py
        └── skills-analyzer.py
```

## 📂 Key Directory Explanations

### Backend (`/backend/`)
- **controller/**: REST API endpoints and request handling
- **service/**: Business logic and core application services
- **repository/**: Data access layer with JPA repositories
- **entity/**: JPA entities representing database tables
- **dto/**: Data Transfer Objects for API communication
- **config/**: Spring Boot configuration classes
- **util/**: Utility classes and helper functions

### Frontend (`/frontend/`)
- **components/**: Reusable React components organized by feature
- **pages/**: Top-level page components
- **hooks/**: Custom React hooks for shared logic
- **services/**: API communication and external service integration
- **utils/**: Utility functions and constants

### Data (`/data/`)
- **analysis_output/**: Generated analysis and schema files
- **import-scripts/**: Python scripts for data processing
- **sample-profiles.json**: Sample data for development
- **linkedin-100m.parquet**: Main dataset (gitignored)

### Documentation (`/docs/`)
- Organized documentation split by functional area
- Each subdirectory contains detailed documentation for that domain
- Cross-referenced for easy navigation