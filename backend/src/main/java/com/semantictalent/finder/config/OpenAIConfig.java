package com.semantictalent.finder.config;

import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.openai.OpenAiEmbeddingClient;
import org.springframework.ai.openai.OpenAiEmbeddingOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAIConfig {
    
    @Value("${spring.ai.openai.api-key}")
    private String openAiApiKey;
    
    @Value("${spring.ai.openai.embedding.options.model:text-embedding-3-small}")
    private String embeddingModel;
    
    @Bean
    public OpenAiApi openAiApi() {
        return new OpenAiApi(openAiApiKey);
    }
    
    @Bean
    public EmbeddingClient embeddingClient(OpenAiApi openAiApi) {
        OpenAiEmbeddingOptions options = OpenAiEmbeddingOptions.builder()
                .withModel(embeddingModel)
                .build();
        
        return new OpenAiEmbeddingClient(openAiApi, options);
    }
}