# Database Schema

## 🗄️ Production Database Schema

### Enhanced Schema with Full Analysis Integration

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Main profiles table (based on analysis of 51M+ records)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- High-quality fields (0-3% null - core functionality)
    full_name VARCHAR(500) NOT NULL,
    first_name VARCHAR(250),
    last_name VARCHAR(250),
    location VARCHAR(200),
    locality VARCHAR(150),
    region VARCHAR(150),
    location_country VARCHAR(100),
    location_continent VARCHAR(50),
    linkedin_url VARCHAR(500),
    linkedin_username VARCHAR(100),
    
    -- Medium-quality fields (11-19% null - secondary features)
    industry VARCHAR(200),
    job_title VARCHAR(300),
    metro VARCHAR(200),
    gender VARCHAR(20),
    last_updated TIMESTAMP,
    
    -- Enhanced processed fields
    headline VARCHAR(500),
    summary TEXT,
    experience_level VARCHAR(50),
    years_experience INTEGER,
    company_name VARCHAR(300),
    
    -- Skills arrays (normalized from 1,871 unique skills)
    skills TEXT[],
    technical_skills TEXT[],
    soft_skills TEXT[],
    
    -- Searchable content for embeddings and full-text search
    searchable_content TEXT,
    
    -- Vector embedding (1536 dimensions - OpenAI text-embedding-3-small)
    embedding vector(1536),
    
    -- Data quality metrics
    data_quality_score DOUBLE PRECISION,
    completeness_score DOUBLE PRECISION,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    import_batch_id VARCHAR(100)
);

-- High-performance indexes based on analysis
CREATE INDEX profiles_embedding_hnsw_idx ON profiles USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_profiles_industry ON profiles(industry) WHERE industry IS NOT NULL;
CREATE INDEX idx_profiles_location_country ON profiles(location_country) WHERE location_country IS NOT NULL;
CREATE INDEX idx_profiles_experience_level ON profiles(experience_level) WHERE experience_level IS NOT NULL;
CREATE INDEX idx_profiles_data_quality ON profiles(data_quality_score) WHERE data_quality_score IS NOT NULL;
CREATE INDEX idx_profiles_skills_gin ON profiles USING gin(skills) WHERE skills IS NOT NULL;
CREATE INDEX idx_profiles_full_text ON profiles USING gin(to_tsvector('english', searchable_content)) WHERE searchable_content IS NOT NULL;
CREATE INDEX idx_profiles_location_trgm ON profiles USING gin(location gin_trgm_ops) WHERE location IS NOT NULL;

-- Skills normalization table (1,871 unique skills identified)
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    normalized_name VARCHAR(200),
    category VARCHAR(50) CHECK (category IN ('TECHNICAL', 'SOFT', 'LANGUAGE', 'CERTIFICATION', 'TOOL', 'FRAMEWORK', 'INDUSTRY')),
    frequency BIGINT DEFAULT 0,
    is_technical BOOLEAN DEFAULT FALSE,
    aliases TEXT[]
);

-- Search analytics table
CREATE TABLE search_queries (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    search_mode VARCHAR(20) DEFAULT 'SEMANTIC',
    user_ip VARCHAR(45),
    results_count INTEGER,
    execution_time_ms INTEGER,
    filters_applied JSONB,
    similarity_threshold DOUBLE PRECISION,
    avg_similarity_score DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Data import tracking
CREATE TABLE import_batches (
    id VARCHAR(100) PRIMARY KEY,
    filename VARCHAR(500),
    total_records BIGINT,
    processed_records BIGINT DEFAULT 0,
    failed_records BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PROCESSING',
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    error_message TEXT
);

-- Populate initial skills data (based on analysis)
INSERT INTO skills (name, category, is_technical, frequency) VALUES
-- Technical skills (18 identified)
('Java', 'TECHNICAL', true, 0),
('Python', 'TECHNICAL', true, 0),
('JavaScript', 'TECHNICAL', true, 0),
('React', 'FRAMEWORK', true, 0),
('Spring Boot', 'FRAMEWORK', true, 0),
('PostgreSQL', 'TECHNICAL', true, 0),
('AWS', 'TOOL', true, 0),
('Docker', 'TOOL', true, 0),
('Kubernetes', 'TOOL', true, 0),
('Machine Learning', 'TECHNICAL', true, 0),
('Node.js', 'TECHNICAL', true, 0),
('TypeScript', 'TECHNICAL', true, 0),
('Angular', 'FRAMEWORK', true, 0),
('Vue.js', 'FRAMEWORK', true, 0),
('MongoDB', 'TECHNICAL', true, 0),
('Redis', 'TECHNICAL', true, 0),
('Elasticsearch', 'TECHNICAL', true, 0),
('GraphQL', 'TECHNICAL', true, 0),

-- Soft skills (20 identified)
('Leadership', 'SOFT', false, 0),
('Communication', 'SOFT', false, 0),
('Project Management', 'SOFT', false, 0),
('Team Management', 'SOFT', false, 0),
('Problem Solving', 'SOFT', false, 0),
('Strategic Thinking', 'SOFT', false, 0),
('Negotiation', 'SOFT', false, 0),
('Mentoring', 'SOFT', false, 0),
('Public Speaking', 'SOFT', false, 0),
('Collaboration', 'SOFT', false, 0),
('Analytical Thinking', 'SOFT', false, 0),
('Creativity', 'SOFT', false, 0),
('Adaptability', 'SOFT', false, 0),
('Time Management', 'SOFT', false, 0),
('Critical Thinking', 'SOFT', false, 0),
('Emotional Intelligence', 'SOFT', false, 0),
('Conflict Resolution', 'SOFT', false, 0),
('Decision Making', 'SOFT', false, 0),
('Customer Service', 'SOFT', false, 0),
('Sales', 'SOFT', false, 0);

-- Create function to update skills frequency
CREATE OR REPLACE FUNCTION update_skills_frequency() RETURNS void AS $$
BEGIN
    UPDATE skills SET frequency = (
        SELECT COUNT(*)
        FROM profiles
        WHERE skills @> ARRAY[skills.name]
    );
END;
$$ LANGUAGE plpgsql;

-- Performance optimization for large dataset
ALTER TABLE profiles SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE profiles SET (autovacuum_analyze_scale_factor = 0.02);

-- Partitioning preparation for 50M+ records (optional)
-- CREATE TABLE profiles_partitioned (LIKE profiles INCLUDING ALL);
-- SELECT create_range_partitions('profiles_partitioned', 'created_at', '2024-01-01'::date, interval '1 month');
```

## 📊 Data Quality Analysis

### Field Quality Levels

#### High Quality Fields (0-3% null)
Used for core search functionality:
- `full_name`, `first_name`, `last_name`
- `location`, `locality`, `region`
- `location_country`, `location_continent`
- `linkedin_url`, `linkedin_username`

#### Medium Quality Fields (11-19% null)
Used for filtering and secondary features:
- `industry` (13.8% null)
- `job_title` (17.0% null)
- `metro` (11.2% null)
- `gender` (16.1% null)
- `last_updated` (18.6% null)

#### Low Quality Fields (54-95% null)
Limited utility, not indexed:
- Contact information (phone, mobile)
- Secondary professional details
- Email addresses

## 🔧 Index Strategy

### Vector Index (HNSW)
```sql
CREATE INDEX profiles_embedding_hnsw_idx 
ON profiles USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);
```

### Full-Text Search Index
```sql
CREATE INDEX idx_profiles_full_text 
ON profiles USING gin(to_tsvector('english', searchable_content));
```

### Skills Array Index
```sql
CREATE INDEX idx_profiles_skills_gin 
ON profiles USING gin(skills);
```

### Filtered Indexes
Only index non-null values for performance:
```sql
CREATE INDEX idx_profiles_industry 
ON profiles(industry) WHERE industry IS NOT NULL;
```