package com.semantictalent.finder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class SemanticTalentFinderApplication {

	public static void main(String[] args) {
		SpringApplication.run(SemanticTalentFinderApplication.class, args);
		System.out.println("Semantic Talent Finder Application Started Successfully!");
	}

}




