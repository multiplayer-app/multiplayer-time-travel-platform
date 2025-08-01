import { idGenerator } from './opentelemetry'
import {
    sessionRecorder,
    SessionType
} from '@multiplayer-app/session-recorder-node'
import {
    MULTIPLAYER_OTLP_KEY,
    ENVIRONMENT,
    COMPONENT_VERSION,
    COMPONENT_NAME
} from './config'
import {
    VaultOfTimeService,
    EpochEngineService,
    MindsOfTimeService,
} from './services'

const main = async () => {
    sessionRecorder.init({
        apiKey: MULTIPLAYER_OTLP_KEY,
        traceIdGenerator: idGenerator,
        resourceAttributes: {
            componentName: COMPONENT_NAME,
            componentVersion: COMPONENT_VERSION,
            environment: ENVIRONMENT
        }
    })

    await sessionRecorder.start(
        SessionType.PLAIN,
        {
            name: 'Test nodejs cli app debug session',
            resourceAttributes: {
                version: 1
            }
        }
    )

    await VaultOfTimeService.fetchHistoricalEvents()

    await EpochEngineService.fetchEpochs()

    await MindsOfTimeService.fetchProminentPersons()

    await sessionRecorder.stop()

    setTimeout(() => {
        process.exit(0)
    }, 15000)
}

main()
