FROM golang:1.23-bookworm AS builder

WORKDIR /app

COPY . .

RUN go mod download

RUN go -C ./src build -v -o ../build/app 

FROM debian:bookworm-slim
RUN set -x && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/build/app /app/build/app

ARG SERVICE_VERSION
ENV SERVICE_VERSION=$SERVICE_VERSION

EXPOSE 3000

CMD ["./app/build/app"]
