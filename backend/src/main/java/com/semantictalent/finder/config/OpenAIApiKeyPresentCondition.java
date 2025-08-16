package com.semantictalent.finder.config;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class OpenAIApiKeyPresentCondition implements Condition {
    
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        String apiKey = context.getEnvironment().getProperty("spring.ai.openai.api-key");
        return apiKey != null && !apiKey.trim().isEmpty();
    }
}