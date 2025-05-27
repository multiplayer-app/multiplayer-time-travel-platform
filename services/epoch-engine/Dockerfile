FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
ARG TARGETARCH
WORKDIR /source

COPY . .

RUN dotnet restore -a $TARGETARCH ./src

RUN dotnet publish --no-restore -a $TARGETARCH -o /app ./src

FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine

ARG SERVICE_VERSION
ENV SERVICE_VERSION=$SERVICE_VERSION

EXPOSE 3000
WORKDIR /app
COPY --from=build /app .

ENTRYPOINT ["dotnet", "WebApiOpenApi.dll", "--urls", "http://0.0.0.0:5000"]
