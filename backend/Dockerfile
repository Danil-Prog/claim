FROM openjdk:17-jdk-slim
VOLUME /tmp
ADD produc/claim-0.0.1-SNAPSHOT.jar application.jar
RUN mkdir "/storage"
ENTRYPOINT ["java", "-jar", "/application.jar"]