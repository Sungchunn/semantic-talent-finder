# Project Overview

## 🎯 Project Summary

**Semantic Talent Finder** is an AI-powered semantic search engine for professional profiles that replaces traditional checkbox filters with natural language queries.

## 📊 Dataset Scale

- **51,352,619 LinkedIn profiles** (15.15 GB dataset)
- **62 data fields** with comprehensive quality analysis
- **12 high-quality fields** (0-3% null values) for core functionality
- **Vector embeddings** ready for 1,871 unique skills
- **Production-ready** for 50M+ profile searches

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3.4.8 + Java 21 + PostgreSQL + pgvector
- **Frontend**: React + React Bits + Tailwind CSS
- **AI**: Spring AI + OpenAI Embeddings (text-embedding-3-small)
- **Database**: PostgreSQL with vector extensions + HNSW indexing
- **Processing**: Batch processing (5,000 records/batch, 67.5 MB memory/batch)

## 🎯 Project Goals

- Enable natural language search: "Find senior Java developers in fintech with startup experience"
- Process the complete 51M+ LinkedIn profiles dataset
- Demonstrate production-scale AI search capabilities
- Learning project for enterprise AI integration patterns

## 📊 Data Quality Analysis

### High Quality Fields (12 fields - 0-3% null values)
- Full name, First Name, Last Name (0.0-0.1% null)
- Location data: Location, Locality, Region (0.1-2.6% null)
- LinkedIn identifiers: LinkedIn URL, Username (0.1% null)
- Geographic data: Location Country, Location Continent (0.1% null)

### Medium Quality Fields (7 fields - 11-19% null values)
- Industry (13.8% null)
- Job title (17.0% null)
- Metro area (11.2% null)
- Gender (16.1% null)
- Last Updated timestamp (18.6% null)

### Low Quality Fields (43 fields - 54-95% null values)
- Contact information: Mobile (94.7% null), Phone numbers (84.6% null)
- Professional details: Sub Role (76.1% null), Industry 2 (60.8% null)
- Email addresses (54.4% null)

## ⚙️ Processing Specifications

- **Recommended Batch Size**: 5,000 records
- **Memory per Batch**: 67.5 MB
- **Estimated Processing Time**: 85.6 hours for full dataset
- **Vector Dimensions**: 1536 (OpenAI text-embedding-3-small)

## 📈 Performance Targets

- **Search Response Time**: < 500ms (99th percentile)
- **Concurrent Users**: 1,000+ simultaneous searches
- **Data Processing**: 5,000 records/batch at 67.5 MB memory
- **Vector Index Build**: < 24 hours for full dataset
- **Search Accuracy**: > 85% relevant results
- **System Uptime**: 99.9% availability