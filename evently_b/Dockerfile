FROM openjdk

WORKDIR /evently_b

COPY .env .env
COPY target/evently-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
