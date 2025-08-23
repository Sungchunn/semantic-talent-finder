package com.semantictalent.finder.config;

import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationPropertiesScan(basePackages = "com.semantictalent.finder.config")
public class ConfigurationPropertiesConfig {
}