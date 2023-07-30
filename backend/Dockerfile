FROM openjdk:17-jdk-slim
VOLUME /tmp
ADD produc/*.jar application.jar
RUN mkdir "/storage"
ENTRYPOINT ["java", "-jar", "/application.jar"]