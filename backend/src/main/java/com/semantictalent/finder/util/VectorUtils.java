package com.semantictalent.finder.util;

import com.pgvector.PGvector;
import lombok.extern.slf4j.Slf4j;
import java.util.Arrays;

@Slf4j
public class VectorUtils {
    
    private static final int EXPECTED_DIMENSION = 1536; // OpenAI text-embedding-3-small dimension
    
    /**
     * Validate that a vector has the expected dimensions
     * @param vector The vector to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidDimension(PGvector vector) {
        if (vector == null) {
            return false;
        }
        
        try {
            float[] array = vector.toArray();
            return array.length == EXPECTED_DIMENSION;
        } catch (Exception e) {
            log.error("Error validating vector dimension", e);
            return false;
        }
    }
    
    /**
     * Create a zero vector with the expected dimensions
     * @return Zero vector
     */
    public static PGvector createZeroVector() {
        float[] zeros = new float[EXPECTED_DIMENSION];
        Arrays.fill(zeros, 0.0f);
        return new PGvector(zeros);
    }
    
    /**
     * Create a random vector with the expected dimensions (for testing)
     * @return Random vector with values between -1 and 1
     */
    public static PGvector createRandomVector() {
        float[] random = new float[EXPECTED_DIMENSION];
        for (int i = 0; i < EXPECTED_DIMENSION; i++) {
            random[i] = (float) (Math.random() * 2.0 - 1.0); // Random between -1 and 1
        }
        return new PGvector(random);
    }
    
    /**
     * Convert a float array to PGvector with validation
     * @param array The float array
     * @return PGvector or null if invalid
     */
    public static PGvector fromFloatArray(float[] array) {
        if (array == null || array.length != EXPECTED_DIMENSION) {
            log.error("Invalid array dimensions: expected {}, got {}", 
                EXPECTED_DIMENSION, array != null ? array.length : "null");
            return null;
        }
        
        // Check for NaN or infinite values
        for (int i = 0; i < array.length; i++) {
            if (Float.isNaN(array[i]) || Float.isInfinite(array[i])) {
                log.error("Invalid value at index {}: {}", i, array[i]);
                return null;
            }
        }
        
        return new PGvector(array);
    }
    
    /**
     * Get the magnitude (length) of a vector
     * @param vector The vector
     * @return Magnitude of the vector
     */
    public static double getMagnitude(PGvector vector) {
        if (vector == null) {
            return 0.0;
        }
        
        try {
            float[] array = vector.toArray();
            double sum = 0.0;
            for (float value : array) {
                sum += value * value;
            }
            return Math.sqrt(sum);
        } catch (Exception e) {
            log.error("Error calculating vector magnitude", e);
            return 0.0;
        }
    }
    
    /**
     * Check if a vector is a zero vector
     * @param vector The vector to check
     * @return true if all elements are zero (or very close to zero)
     */
    public static boolean isZeroVector(PGvector vector) {
        if (vector == null) {
            return true;
        }
        
        try {
            float[] array = vector.toArray();
            for (float value : array) {
                if (Math.abs(value) > 1e-9) { // Small epsilon for floating point comparison
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            log.error("Error checking if vector is zero", e);
            return true;
        }
    }
    
    /**
     * Get basic statistics about a vector
     * @param vector The vector
     * @return String with min, max, mean, and std dev
     */
    public static String getVectorStats(PGvector vector) {
        if (vector == null) {
            return "null vector";
        }
        
        try {
            float[] array = vector.toArray();
            
            float min = array[0];
            float max = array[0];
            double sum = 0.0;
            
            for (float value : array) {
                min = Math.min(min, value);
                max = Math.max(max, value);
                sum += value;
            }
            
            double mean = sum / array.length;
            
            double variance = 0.0;
            for (float value : array) {
                double diff = value - mean;
                variance += diff * diff;
            }
            variance /= array.length;
            double stdDev = Math.sqrt(variance);
            
            return String.format("min=%.4f, max=%.4f, mean=%.4f, std=%.4f, dim=%d", 
                min, max, mean, stdDev, array.length);
                
        } catch (Exception e) {
            log.error("Error calculating vector statistics", e);
            return "error calculating stats";
        }
    }
}