# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:21-jdk-jammy

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and the project description file
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download project dependencies
# This is done as a separate step to leverage Docker layer caching
RUN ./mvnw dependency:go-offline

# Copy the project source code
COPY src ./src

# Package the application
RUN ./mvnw package -DskipTests

# Expose the port the app runs on
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "target/semantic-talent-finder-0.0.1-SNAPSHOT.jar"]
