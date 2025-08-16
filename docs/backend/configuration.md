# Backend Configuration

## 🛠️ Spring Boot Configuration

### Application Structure
```java
// Main Application Class
package com.semantictalent.finder;

@SpringBootApplication
@EnableJpaRepositories
@EnableBatchProcessing
public class SemanticTalentFinderApplication {
    public static void main(String[] args) {
        SpringApplication.run(SemanticTalentFinderApplication.class, args);
    }
}
```

## 📄 Configuration Files

### `application.yml` (Development)
```yaml
spring:
  application:
    name: semantic-talent-finder
  
  datasource:
    url: jdbc:postgresql://localhost:5432/semantic_talent_finder
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: false
        jdbc:
          batch_size: 100
        order_inserts: true
        order_updates: true
    show-sql: false
  
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-3.5-turbo
      embedding:
        options:
          model: text-embedding-3-small
          dimensions: 1536
  
  batch:
    job:
      enabled: false
    jdbc:
      initialize-schema: embedded
  
  security:
    oauth2:
      client:
        registration:
          github:
            client-id: ${GITHUB_CLIENT_ID:}
            client-secret: ${GITHUB_CLIENT_SECRET:}

server:
  port: 8080
  
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

logging:
  level:
    com.semantictalent.finder: INFO
    org.springframework.ai: WARN
    org.hibernate.SQL: WARN
    org.springframework.batch: INFO

# Custom application properties
app:
  data:
    batch-size: 5000
    processing:
      max-threads: 4
      chunk-size: 1000
  search:
    default-limit: 20
    max-limit: 100
    similarity-threshold: 0.7
  skills:
    technical-count: 18
    soft-count: 20
    total-unique: 1871
```

### `application-prod.yml` (Production)
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    hikari:
      maximum-pool-size: 50
      minimum-idle: 10
      connection-timeout: 30000
      idle-timeout: 300000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
  
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 1000
          fetch_size: 1000
        cache:
          use_second_level_cache: true
          use_query_cache: true
        generate_statistics: true
    show-sql: false

# Custom properties for 50M+ dataset
app:
  data:
    batch-size: 5000              # From analysis recommendation
    processing:
      max-threads: 8              # Scale up for production
      chunk-size: 1000
      memory-per-batch-mb: 67.5   # From analysis
  search:
    default-limit: 20
    max-limit: 1000               # Increased for enterprise
    similarity-threshold: 0.7
    cache-ttl-minutes: 60
  vector:
    dimensions: 1536              # OpenAI text-embedding-3-small
    index-type: "hnsw"
    ef-construction: 200          # Higher for better recall
    m-connections: 32             # Higher for large dataset
  skills:
    total-unique: 1871            # From analysis
    technical-count: 18           # From analysis
    soft-count: 20               # From analysis
    normalization-enabled: true

management:
  metrics:
    export:
      prometheus:
        enabled: true
      datadog:
        enabled: ${DATADOG_ENABLED:false}
  endpoint:
    metrics:
      enabled: true
```

## ⚙️ Configuration Classes

### OpenAI Configuration
```java
@Configuration
public class OpenAIConfig {
    
    @Value("${spring.ai.openai.api-key}")
    private String apiKey;
    
    @Bean
    public OpenAiEmbeddingModel embeddingModel() {
        return new OpenAiEmbeddingModel(apiKey, 
            OpenAiEmbeddingOptions.builder()
                .withModel("text-embedding-3-small")
                .withDimensions(1536)
                .build());
    }
}
```

### Database Configuration
```java
@Configuration
@EnableJpaRepositories
public class DatabaseConfig {
    
    @Bean
    @ConfigurationProperties("spring.datasource")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource());
        em.setPackagesToScan("com.semantictalent.finder.entity");
        
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        
        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "validate");
        properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        em.setJpaPropertyMap(properties);
        
        return em;
    }
}
```

### Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/health/**").permitAll()
                .requestMatchers("/api/search/**").permitAll()
                .requestMatchers("/api/profiles/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### Batch Processing Configuration
```java
@Configuration
@EnableBatchProcessing
public class BatchProcessingConfig {
    
    @Value("${app.data.batch-size}")
    private Integer batchSize;
    
    @Value("${app.data.processing.max-threads}")
    private Integer maxThreads;
    
    @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(maxThreads);
        executor.setMaxPoolSize(maxThreads * 2);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("DataImport-");
        executor.initialize();
        return executor;
    }
}
```