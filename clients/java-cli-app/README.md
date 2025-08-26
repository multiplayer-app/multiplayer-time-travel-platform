## Java cli example app

```bash
./gradlew build --refresh-dependencies
./gradlew clean shadowJar

MINDS_OF_TIME_SERVICE_URL=https://api.demo.multiplayer.app \
EPOCH_ENGINE_SERVICE_URL=https://api.demo.multiplayer.app \
VAULT_OF_TIME_SERVICE_URL=https://api.demo.multiplayer.app \
MULTIPLAYER_OTLP_KEY="{{KEY}}" \
java -jar ./build/libs/java-cli-app-0.0.1-all.jar
```
