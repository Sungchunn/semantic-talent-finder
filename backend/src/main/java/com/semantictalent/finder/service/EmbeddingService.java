package com.semantictalent.finder.service;

import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.pgvector.PGvector;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmbeddingService {
    
    @Autowired
    private EmbeddingClient embeddingClient;
    
    public PGvector generateEmbedding(String text) {
        try {
            log.debug("Generating embedding for text: {}", text.substring(0, Math.min(text.length(), 100)));
            
            EmbeddingRequest request = EmbeddingRequest.builder()
                    .input(text)
                    .build();
            
            EmbeddingResponse response = embeddingClient.call(request);
            float[] embedding = response.getResults().get(0).getOutput();
            
            return new PGvector(embedding);
        } catch (Exception e) {
            log.error("Error generating embedding for text: {}", text, e);
            throw new RuntimeException("Failed to generate embedding", e);
        }
    }
    
    public PGvector generateProfileEmbedding(String fullName, String headline, String summary, String[] skills) {
        StringBuilder profileText = new StringBuilder();
        
        if (fullName != null) profileText.append(fullName).append(" ");
        if (headline != null) profileText.append(headline).append(" ");
        if (summary != null) profileText.append(summary).append(" ");
        if (skills != null) {
            for (String skill : skills) {
                profileText.append(skill).append(" ");
            }
        }
        
        return generateEmbedding(profileText.toString().trim());
    }
}