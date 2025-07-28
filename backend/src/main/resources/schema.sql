-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE INDEX IF NOT EXISTS idx_profiles_embedding_hnsw ON profiles USING hnsw (embedding vector_cosine_ops);

-- Additional indexes for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_industry ON profiles(industry);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_company_name ON profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- GIN index for skills array
CREATE INDEX IF NOT EXISTS idx_profiles_skills_gin ON profiles USING GIN(skills);

-- Search queries table for analytics
CREATE TABLE IF NOT EXISTS search_queries (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    user_ip VARCHAR(45),
    results_count INTEGER,
    execution_time_ms INTEGER,
    filters_applied JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for search analytics
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at);
CREATE INDEX IF NOT EXISTS idx_search_queries_user_ip ON search_queries(user_ip);
CREATE INDEX IF NOT EXISTS idx_search_queries_query_text ON search_queries(query_text);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();