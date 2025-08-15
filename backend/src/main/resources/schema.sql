-- Production Database Schema for Semantic Talent Finder
-- Based on analysis of 51,352,619 LinkedIn profiles (15.15 GB dataset)
-- Optimized for 50M+ profile searches with vector similarity

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- Main profiles table (based on comprehensive dataset analysis)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- High-quality fields (0-3% null - core functionality from analysis)
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
    
    -- Medium-quality fields (11-19% null - secondary features from analysis)
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
    
    -- Skills arrays (normalized from 1,871 unique skills identified in analysis)
    skills TEXT[],
    technical_skills TEXT[],
    soft_skills TEXT[],
    
    -- Searchable content for embeddings and full-text search
    searchable_content TEXT,
    
    -- Vector embedding (1536 dimensions - OpenAI text-embedding-3-small)
    embedding vector(1536),
    
    -- Data quality metrics (based on quality analysis)
    data_quality_score DOUBLE PRECISION,
    completeness_score DOUBLE PRECISION,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    import_batch_id VARCHAR(100)
);

-- High-performance indexes optimized for 50M+ records
-- HNSW index for vector similarity search (production-optimized)
CREATE INDEX IF NOT EXISTS profiles_embedding_hnsw_idx ON profiles 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (m = 16, ef_construction = 64);

-- Indexes for high-quality fields (used in filters)
CREATE INDEX IF NOT EXISTS idx_profiles_industry ON profiles(industry) 
    WHERE industry IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_location_country ON profiles(location_country) 
    WHERE location_country IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON profiles(experience_level) 
    WHERE experience_level IS NOT NULL;

-- Data quality and performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_data_quality ON profiles(data_quality_score) 
    WHERE data_quality_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_completeness ON profiles(completeness_score) 
    WHERE completeness_score IS NOT NULL;

-- Skills search optimization (GIN indexes for array operations)
CREATE INDEX IF NOT EXISTS idx_profiles_skills_gin ON profiles USING gin(skills) 
    WHERE skills IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_technical_skills_gin ON profiles USING gin(technical_skills) 
    WHERE technical_skills IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_soft_skills_gin ON profiles USING gin(soft_skills) 
    WHERE soft_skills IS NOT NULL;

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_profiles_full_text ON profiles 
    USING gin(to_tsvector('english', searchable_content)) 
    WHERE searchable_content IS NOT NULL;

-- Skills normalization table (1,871 unique skills from analysis)
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    normalized_name VARCHAR(200),
    category VARCHAR(50) CHECK (category IN ('TECHNICAL', 'SOFT', 'LANGUAGE', 'CERTIFICATION', 'TOOL', 'FRAMEWORK', 'INDUSTRY')),
    frequency BIGINT DEFAULT 0,
    is_technical BOOLEAN DEFAULT FALSE,
    aliases TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_frequency ON skills(frequency DESC);
CREATE INDEX IF NOT EXISTS idx_skills_technical ON skills(is_technical);

-- Enhanced search analytics table
CREATE TABLE IF NOT EXISTS search_queries (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    search_mode VARCHAR(20) DEFAULT 'SEMANTIC' CHECK (search_mode IN ('SEMANTIC', 'FULL_TEXT', 'HYBRID')),
    user_ip VARCHAR(45),
    results_count INTEGER,
    execution_time_ms INTEGER,
    filters_applied JSONB,
    similarity_threshold DOUBLE PRECISION,
    avg_similarity_score DOUBLE PRECISION,
    high_quality_results INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Search analytics indexes
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at);
CREATE INDEX IF NOT EXISTS idx_search_queries_mode ON search_queries(search_mode);
CREATE INDEX IF NOT EXISTS idx_search_queries_execution_time ON search_queries(execution_time_ms);

-- Data import tracking table for batch processing
CREATE TABLE IF NOT EXISTS import_batches (
    id VARCHAR(100) PRIMARY KEY,
    filename VARCHAR(500),
    total_records BIGINT,
    processed_records BIGINT DEFAULT 0,
    failed_records BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PROCESSING' CHECK (status IN ('PROCESSING', 'COMPLETED', 'FAILED')),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    execution_time_ms BIGINT,
    error_message TEXT,
    batch_size INTEGER DEFAULT 5000
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at 
    BEFORE UPDATE ON skills 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();