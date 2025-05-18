FROM gradle:8-jdk17 AS build

WORKDIR /usr/app/

COPY . .

RUN ./gradlew clean build

FROM openjdk:17-jdk-slim

ARG SERVICE_VERSION
ENV SERVICE_VERSION=$SERVICE_VERSION

WORKDIR /usr/app/

COPY --from=build /usr/app/build/libs/app-0.0.1.jar app.jar

EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]
