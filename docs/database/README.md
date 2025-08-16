# Database Documentation

## 📁 Database Structure

- **[schema.md](./schema.md)** - Complete database schema with vector extensions
- **[queries.md](./queries.md)** - Advanced queries and repository methods
- **[optimization.md](./optimization.md)** - Performance optimization and indexing
- **[migrations.md](./migrations.md)** - Database migrations and version control

## 🗄️ Database Overview

### Technology Stack
- **PostgreSQL 16**: Primary database
- **pgvector**: Vector similarity search extension
- **HNSW Indexing**: High-performance vector indexing
- **JPA/Hibernate**: ORM layer

### Data Scale
- **51,352,619 profiles**: Production dataset size
- **1,536 dimensions**: Vector embedding size
- **1,871 skills**: Normalized skill categories
- **62 fields**: Total profile fields analyzed

### Performance Characteristics
- **< 500ms**: Search response time target
- **5,000 records/batch**: Optimal batch processing size
- **67.5 MB/batch**: Memory usage per batch
- **HNSW indexing**: Sub-linear search complexity