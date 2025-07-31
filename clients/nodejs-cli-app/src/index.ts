import { idGenerator } from './opentelemetry'
import { debugger } from '@multiplayer-app/debugger-node'
import { DebugSessionType } from '@multiplayer-app/opentelemetry'
import {
    MULTIPLAYER_OTLP_KEY,
    SERVICE_NAME,
    SERVICE_VERSION,
    PLATFORM_ENV
 } from './config'
import {
    VaultOfTimeService,
    EpochEngineService,
    MindsOfTimeService,
} from './services'

const main = async () => {
    debugger.init(
        MULTIPLAYER_OTLP_KEY,
        idGenerator,
        {
            resourceAttributes: {
                serviceName: SERVICE_NAME
                componentName: SERVICE_VERSION
                PLATFORM_ENV
            }
        }
    )

    await debugger.start(
        DebugSessionType.PLAIN,
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

    await debugger.stop()

    setTimeout(() => {
        process.exit(0)
    }, 15000)
}

main()
