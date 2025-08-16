# Semantic Talent Finder - Claude Code Development Guide

## 🚨 CRITICAL REQUIREMENTS

### Project Scope & Access Restrictions
**Claude Code is RESTRICTED to working within this project directory ONLY:**
```
/Users/chromatrical/CAREER/Side Projects/semantic-talent-finder
```

### Security & Git Requirements
- **🚫 NEVER force push** (`git push --force` or `git push -f`)
- **🔐 NEVER commit API keys or secrets** to the repository
- **📝 ALWAYS commit after substantial changes** with descriptive messages
- **✅ Include co-author attribution**: `Co-Authored-By: Claude <noreply@anthropic.com>`

### Environment Variables Required
```bash
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_db_password
```

---

## 🎯 Project Quick Reference

**Semantic Talent Finder** is an AI-powered semantic search engine for professional profiles.

### Key Metrics
- **51,352,619 LinkedIn profiles** (15.15 GB dataset)
- **1,871 unique skills** normalized and categorized
- **1536-dimensional vectors** (OpenAI text-embedding-3-small)
- **5,000 records/batch** processing (67.5 MB memory/batch)

### Tech Stack
- **Backend**: Spring Boot 3.4.8 + Java 21 + PostgreSQL + pgvector
- **Frontend**: React + TypeScript + TailwindCSS (v4 compatibility issue - see Known Issues)
- **AI**: Spring AI + OpenAI Embeddings
- **Database**: PostgreSQL with vector extensions + HNSW indexing

### Current Status (2025-08-16)
- ✅ **Backend**: http://localhost:8080 (fully functional)
- ✅ **Frontend**: http://localhost:3000 (functional, styling needs work)
- ✅ **Database**: PostgreSQL + pgvector on port 5433
- 🔧 **TailwindCSS**: Temporarily disabled due to v4 compatibility issue

---

## 📚 Documentation Structure

**All detailed documentation has been organized in the `/docs/` directory for better maintainability.**

### 📖 Core Documentation
- **[Project Overview](./docs/project-overview.md)** - Goals, dataset scale, tech stack
- **[Security Guidelines](./docs/security-guidelines.md)** - Security requirements and git workflow  
- **[Project Structure](./docs/project-structure.md)** - Complete directory organization
- **[Known Issues](./docs/known-issues.md)** - Current issues and fixes
- **[Roadmap](./docs/roadmap.md)** - Development phases and features

### 🏗️ Architecture Documentation
- **[Backend Documentation](./docs/backend/)** - Spring Boot configuration, services, entities
- **[Database Documentation](./docs/database/)** - Schema, queries, optimization
- **[Data Processing Documentation](./docs/data-processing/)** - Batch processing, import pipeline
- **[Frontend Documentation](./docs/frontend/)** - React components, hooks, services

### 🚀 Operations Documentation  
- **[Deployment Documentation](./docs/deployment/)** - Docker, production deployment
- **[Monitoring Documentation](./docs/monitoring/)** - Performance monitoring, analytics
- **[Testing Documentation](./docs/testing/)** - Testing strategies, benchmarks

---

## 🚀 Quick Start Commands

### Development Environment
```bash
# Start backend and database
cd backend && ./mvnw spring-boot:run

# Start frontend (separate terminal)
cd frontend && npm start

# Start database only
docker-compose up postgres
```

### Common Development Tasks
```bash
# Backend: Run tests
cd backend && ./mvnw test

# Frontend: Install dependencies
cd frontend && npm install

# Database: Connect to PostgreSQL
docker exec -it semantic-talent-finder-postgres-1 psql -U postgres -d semantic_talent_finder

# Import data
curl -X POST http://localhost:8080/api/import/parquet -d '{"filename":"data/USA_filtered.parquet"}'
```

---

## 🔧 Current Priority Tasks

### Immediate (High Priority)
1. **Fix TailwindCSS v4 compatibility** - Frontend styling currently broken
2. **Complete data import pipeline** - Process parquet files efficiently
3. **Implement search functionality** - Core semantic search features
4. **Add error handling** - React error boundaries and proper error states

### Short Term (This Sprint)
1. **Performance optimization** - Database query optimization
2. **Component testing** - React Testing Library implementation  
3. **Analytics dashboard** - Data quality and search metrics
4. **Responsive design** - Mobile-friendly UI

---

## 📊 Performance Targets

Based on analysis of 51M+ profile dataset:
- **Search Response**: < 500ms (99th percentile)
- **Concurrent Users**: 1,000+ simultaneous searches
- **Data Processing**: 5,000 records/batch at 67.5 MB memory
- **System Uptime**: 99.9% availability

---

## 🎯 Development Guidelines

### Code Quality
- Follow existing patterns in the codebase
- Use TypeScript for frontend development
- Implement comprehensive error handling
- Add unit tests for new functionality

### Performance
- Optimize database queries with proper indexing
- Use batch processing for large datasets
- Implement caching where appropriate
- Monitor memory usage in data processing

### Security
- Use environment variables for all secrets
- Validate all user inputs
- Implement proper error handling without exposing system details
- Follow OWASP security guidelines

---

## 📞 Quick Reference Links

- **Main Documentation**: [./docs/README.md](./docs/README.md)
- **Backend API**: http://localhost:8080/actuator/health
- **Frontend App**: http://localhost:3000
- **Database Schema**: [./docs/database/schema.md](./docs/database/schema.md)
- **Known Issues**: [./docs/known-issues.md](./docs/known-issues.md)

---

**💡 Remember**: This project processes 51,352,619 real LinkedIn profiles with production-ready architecture. Focus on performance, scalability, and data quality while maintaining clean, documented code.

For detailed implementation guidance, refer to the organized documentation in the `/docs/` directory.

## 📋 Legacy Content Notice

**The detailed content that was previously in this file has been reorganized into the `/docs/` directory for better maintainability and navigation.**

All implementation details, configuration examples, code samples, and technical specifications can now be found in the structured documentation at:

📁 **[./docs/README.md](./docs/README.md)** - Start here for complete documentation navigation

This streamlined CLAUDE.md now serves as a quick reference and entry point to the comprehensive documentation system.