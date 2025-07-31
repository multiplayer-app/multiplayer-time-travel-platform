# Time Travel app


### Table of Contents

* [Get started](#get_started) 
* [Endpoints](#endpoints)
* [OTLP collector config](services/otel-collector/README.md)

## Get started

Create `.env` from `.env.example` and update it's content

Then run command
```bash
docker-compose up -d
```

## Endpoints

http://localhost:8080/v1/epoch-engine/docs - hardcoded dates of birth/death for prominent figures

http://localhost:8080/v1/dialogue-hub/docs - chat with ai

http://localhost:8080/v1/minds-of-time/docs - hardcoded prominent figures

http://localhost:8080/v1/vault-of-time/docs - historical events

http://localhost:8080/v1/timegate/docs - gateway docs
 