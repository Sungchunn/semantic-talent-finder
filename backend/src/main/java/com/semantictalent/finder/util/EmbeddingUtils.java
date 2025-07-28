package com.semantictalent.finder.util;

import com.pgvector.PGvector;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class EmbeddingUtils {
    
    /**
     * Calculate cosine similarity between two embeddings
     * @param embedding1 First embedding vector
     * @param embedding2 Second embedding vector
     * @return Cosine similarity score between -1 and 1
     */
    public static double cosineSimilarity(PGvector embedding1, PGvector embedding2) {
        if (embedding1 == null || embedding2 == null) {
            return 0.0;
        }
        
        try {
            float[] vec1 = embedding1.toArray();
            float[] vec2 = embedding2.toArray();
            
            if (vec1.length != vec2.length) {
                log.warn("Embedding vectors have different dimensions: {} vs {}", vec1.length, vec2.length);
                return 0.0;
            }
            
            double dotProduct = 0.0;
            double norm1 = 0.0;
            double norm2 = 0.0;
            
            for (int i = 0; i < vec1.length; i++) {
                dotProduct += vec1[i] * vec2[i];
                norm1 += vec1[i] * vec1[i];
                norm2 += vec2[i] * vec2[i];
            }
            
            if (norm1 == 0.0 || norm2 == 0.0) {
                return 0.0;
            }
            
            return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
            
        } catch (Exception e) {
            log.error("Error calculating cosine similarity", e);
            return 0.0;
        }
    }
    
    /**
     * Calculate Euclidean distance between two embeddings
     * @param embedding1 First embedding vector
     * @param embedding2 Second embedding vector
     * @return Euclidean distance
     */
    public static double euclideanDistance(PGvector embedding1, PGvector embedding2) {
        if (embedding1 == null || embedding2 == null) {
            return Double.MAX_VALUE;
        }
        
        try {
            float[] vec1 = embedding1.toArray();
            float[] vec2 = embedding2.toArray();
            
            if (vec1.length != vec2.length) {
                log.warn("Embedding vectors have different dimensions: {} vs {}", vec1.length, vec2.length);
                return Double.MAX_VALUE;
            }
            
            double sum = 0.0;
            for (int i = 0; i < vec1.length; i++) {
                double diff = vec1[i] - vec2[i];
                sum += diff * diff;
            }
            
            return Math.sqrt(sum);
            
        } catch (Exception e) {
            log.error("Error calculating Euclidean distance", e);
            return Double.MAX_VALUE;
        }
    }
    
    /**
     * Normalize an embedding vector to unit length
     * @param embedding The embedding to normalize
     * @return Normalized embedding
     */
    public static PGvector normalizeEmbedding(PGvector embedding) {
        if (embedding == null) {
            return null;
        }
        
        try {
            float[] vec = embedding.toArray();
            double norm = 0.0;
            
            // Calculate norm
            for (float value : vec) {
                norm += value * value;
            }
            norm = Math.sqrt(norm);
            
            if (norm == 0.0) {
                return embedding; // Return original if norm is zero
            }
            
            // Normalize
            float[] normalizedVec = new float[vec.length];
            for (int i = 0; i < vec.length; i++) {
                normalizedVec[i] = (float) (vec[i] / norm);
            }
            
            return new PGvector(normalizedVec);
            
        } catch (Exception e) {
            log.error("Error normalizing embedding", e);
            return embedding; // Return original on error
        }
    }
    
    /**
     * Convert similarity score to distance score (for sorting purposes)
     * @param similarity Similarity score (higher = more similar)
     * @return Distance score (lower = more similar)
     */
    public static double similarityToDistance(double similarity) {
        return 1.0 - similarity;
    }
    
    /**
     * Convert distance score to similarity score
     * @param distance Distance score (lower = more similar)
     * @return Similarity score (higher = more similar)
     */
    public static double distanceToSimilarity(double distance) {
        return 1.0 - distance;
    }
}