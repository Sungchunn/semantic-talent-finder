# Data Processing Documentation

## 📁 Data Processing Structure

- **[batch-processing.md](./batch-processing.md)** - Batch processing service and configuration
- **[data-import.md](./data-import.md)** - Data import pipeline and parquet processing
- **[skills-analysis.md](./skills-analysis.md)** - Skills normalization and categorization
- **[quality-scoring.md](./quality-scoring.md)** - Data quality metrics and scoring

## 🚀 Processing Overview

### Data Scale & Performance
- **Dataset Size**: 51,352,619 LinkedIn profiles (15.15 GB)
- **Batch Size**: 5,000 records (optimal based on analysis)
- **Memory Usage**: 67.5 MB per batch
- **Processing Time**: ~85.6 hours for full dataset
- **Concurrent Threads**: 4-8 (configurable)

### Processing Pipeline
1. **Parquet File Reading**: Stream large datasets efficiently
2. **Data Enrichment**: Calculate quality scores and normalize skills
3. **Embedding Generation**: OpenAI text-embedding-3-small (1536 dimensions)
4. **Batch Database Insert**: Optimized batch operations
5. **Progress Tracking**: Real-time import monitoring

### Key Features
- **Async Processing**: CompletableFuture for non-blocking operations
- **Error Handling**: Robust error recovery and reporting
- **Memory Management**: Optimized for large dataset processing
- **Quality Scoring**: Automated data quality assessment
- **Skills Normalization**: 1,871 unique skills categorized