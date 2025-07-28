CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Full name VARCHAR(255) NOT NULL,
    Industry VARCHAR(255),
    Job title VARCHAR(255),
    Sub Role VARCHAR(255),
    Industry 2 VARCHAR(255),
    Emails VARCHAR(255),
    Mobile VARCHAR(255),
    Phone numbers VARCHAR(255),
    Company Name VARCHAR(255),
    Company Industry VARCHAR(255),
    Company Website VARCHAR(255),
    Company Size VARCHAR(255),
    Company Founded VARCHAR(255),
    Location VARCHAR(255) NOT NULL,
    Locality VARCHAR(255),
    Metro VARCHAR(255),
    Region VARCHAR(255),
    Skills VARCHAR(255),
    First Name VARCHAR(255) NOT NULL,
    Middle Initial VARCHAR(255),
    Middle Name VARCHAR(255),
    Last Name VARCHAR(255) NOT NULL,
    Birth Year VARCHAR(255),
    Birth Date VARCHAR(255),
    Gender VARCHAR(255),
    LinkedIn Url VARCHAR(255) NOT NULL,
    LinkedIn Username VARCHAR(255) NOT NULL,
    Facebook Url VARCHAR(255),
    Facebook Username VARCHAR(255),
    Twitter Url VARCHAR(255),
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX CONCURRENTLY profiles_embedding_hnsw_idx ON profiles USING hnsw (embedding vector_cosine_ops);
CREATE INDEX CONCURRENTLY idx_profiles_Full name ON profiles(Full name);
CREATE INDEX CONCURRENTLY idx_profiles_Location ON profiles(Location);
CREATE INDEX CONCURRENTLY idx_profiles_Locality ON profiles(Locality);
CREATE INDEX CONCURRENTLY idx_profiles_Region ON profiles(Region);
CREATE INDEX CONCURRENTLY idx_profiles_First Name ON profiles(First Name);
