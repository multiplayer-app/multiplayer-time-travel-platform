FROM gradle:8-jdk17 AS build

WORKDIR /usr/app/

COPY . .
COPY application.properties application.properties

RUN ./gradlew clean build

FROM openjdk:17-jdk-slim

ARG SERVICE_VERSION
ENV SERVICE_VERSION=$SERVICE_VERSION

WORKDIR /usr/app/

COPY --from=build /usr/app/build/libs/app-0.0.1.jar app.jar
COPY --from=build /usr/app/application.properties application.properties

EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]
