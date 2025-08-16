# Backend Documentation

## 📁 Backend Structure

- **[configuration.md](./configuration.md)** - Spring Boot configuration and application properties
- **[entities-and-models.md](./entities-and-models.md)** - JPA entities and data models
- **[services.md](./services.md)** - Business logic and service implementations
- **[repositories.md](./repositories.md)** - Data access layer and custom queries
- **[controllers.md](./controllers.md)** - REST API endpoints and controllers
- **[utilities.md](./utilities.md)** - Utility classes and helper functions

## 🛠️ Spring Boot Architecture

The backend follows a layered architecture pattern:

1. **Controller Layer**: REST API endpoints (`@RestController`)
2. **Service Layer**: Business logic (`@Service`)
3. **Repository Layer**: Data access (`@Repository`)
4. **Entity Layer**: JPA entities (`@Entity`)
5. **Configuration Layer**: Spring configuration (`@Configuration`)

## 🔧 Key Technologies

- **Spring Boot 3.4.8**: Main framework
- **Java 21**: Programming language
- **Spring AI**: OpenAI integration
- **Spring Data JPA**: Database ORM
- **PostgreSQL**: Primary database
- **pgvector**: Vector database extension
- **OpenAI API**: Embedding generation

## 📊 Production Scale Features

- **Batch Processing**: 5,000 records per batch
- **Vector Search**: HNSW indexing for 50M+ profiles
- **Performance Monitoring**: Micrometer metrics
- **Async Processing**: CompletableFuture for data import
- **Connection Pooling**: HikariCP configuration