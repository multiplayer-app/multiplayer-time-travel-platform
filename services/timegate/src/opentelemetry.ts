import { hostname } from "os"
import { node, NodeSDK } from "@opentelemetry/sdk-node"
import {
  // BatchSpanProcessor,
  ParentBasedSampler,
} from "@opentelemetry/sdk-trace-base"
import {
  getNodeAutoInstrumentations,
  getResourceDetectors,
} from "@opentelemetry/auto-instrumentations-node"
import { detectResources, resourceFromAttributes } from "@opentelemetry/resources"
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  SEMRESATTRS_HOST_NAME,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_PROCESS_RUNTIME_VERSION,
  SEMRESATTRS_PROCESS_PID,
} from "@opentelemetry/semantic-conventions"
import api from "@opentelemetry/api"
// import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { W3CTraceContextPropagator } from "@opentelemetry/core"
import {
  MultiplayerHttpTraceExporterNode,
  MultiplayerTraceIdRatioBasedSampler,
  MultiplayerIdGenerator,
  // MultiplayerFilterTraceExporter,
  MultiplayerHttpInstrumentationHooks,
  MultiplayerHttpLogExporterNode,
} from "@multiplayer-app/otlp-core"
import { LoggerProvider, BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import * as apiLogs from "@opentelemetry/api-logs"
import {
  SERVICE_NAME,
  SERVICE_VERSION,
  PLATFORM_ENV,
  MULTIPLAYER_OTLP_KEY,
} from './config'
// import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'

// NOTE: Change those variables before testing
// const SERVICE_NAME = "<example-service-name>"
// const SERVICE_VERSION = "<service-version>"
// const PLATFORM_ENV = "<environment-name>"
// const MULTIPLAYER_OTLP_KEY = "<multiplayer-key>"

// NOTE: Update instrumentation configuration as needed
// For more see: https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node
const instrumentations = [
  getNodeAutoInstrumentations({
    "@opentelemetry/instrumentation-http": {
      requestHook: MultiplayerHttpInstrumentationHooks.requestHook({
        headersToMask: ["X-Api-Key"],
        maxPayloadSize: 5000,
        schemifyDocSpanPayload: true,
        maskDebSpanPayload: true,
      }),
      responseHook: MultiplayerHttpInstrumentationHooks.responseHook({
        headersToMask: ["X-Api-Key"],
        maxPayloadSize: 5000,
        schemifyDocSpanPayload: true,
        maskDebSpanPayload: true
      }),
    },
  }),
]

const getResource = () => {
  const resourcesWithDetectors = detectResources({
    detectors: getResourceDetectors(),
  })
  const resourceWithAttributes = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: SERVICE_VERSION,
    [SEMRESATTRS_HOST_NAME]: hostname(),
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: PLATFORM_ENV,
    [SEMRESATTRS_PROCESS_RUNTIME_VERSION]: process.version,
    [SEMRESATTRS_PROCESS_PID]: process.pid,
  })
  const resource = resourceWithAttributes.merge(resourcesWithDetectors)

  return resource
}

const opentelemetry = () => {
  // NOTE: Either use MultiplayerHttpTraceExporterNode or OTLPTraceExporter
  const multiplayerTraceExporter = new MultiplayerHttpTraceExporterNode({
    apiKey: MULTIPLAYER_OTLP_KEY,
  })
  // const multiplayerTraceExporter = new OTLPTraceExporter({
  //   url: 'https://api.multiplayer.app/v1/traces',
  //   headers: {
  //     Authorization: MULTIPLAYER_OTLP_KEY
  //   },
  // })

  // NOTE: if you want to send traces to one more OpenTelemetry provider
  // uncomment lines below use these variables: `apmProviderTraceExporter`, `apmProviderTraceExporter`
  // const apmProviderTraceExporter = new OTLPTraceExporter({
  //   url: 'http://some.collector.url/v1/traces',
  // })
  // NOTE: Use MultiplayerFilterTraceExporter exporter wrapper to remove Multiplayer attributes (starts with `multiplayer.*` prefix)
  // before sending traces to your APM provider
  // const apmFilteredTraceExporter = new MultiplayerFilterTraceExporter(apmProviderTraceExporter) 
  const resource = getResource()

  const provider = new node.NodeTracerProvider({
    resource,
    spanProcessors: [
      // new BatchSpanProcessor(apmFilteredTraceExporter),
    //   new BatchSpanProcessor(multiplayerTraceExporter),
    ],
    sampler: new ParentBasedSampler({
      // NOTE: this config will send 80% of all traces + 100% of debug traces + 30% of 80% document traces
      root: new MultiplayerTraceIdRatioBasedSampler(0.8),
    }),
    // NOTE: this will set 30% of the traces sampled above for auto documentation
    idGenerator: new MultiplayerIdGenerator({ autoDocTracesRatio: 0.3 }),
  })

  // Initialise logger provider and exporting logs to collector
  const loggerProvider = new LoggerProvider({
    resource,
  })

  // NOTE: Either use `MultiplayerHttpLogExporterNode` or `OTLPLogExporter`
  const multiplayerLogExporter = new MultiplayerHttpLogExporterNode({
    apiKey: MULTIPLAYER_OTLP_KEY,
  })
  // const multiplayerLogExporter = new OTLPLogExporter({
  //   url: 'https://api.multiplayer.app/v1/logs',
  //   headers: {
  //     Authorization: MULTIPLAYER_OTLP_KEY
  //   },
  // })

  const logRecordProcessor = new BatchLogRecordProcessor(multiplayerLogExporter)
  loggerProvider.addLogRecordProcessor(logRecordProcessor)

  apiLogs.logs.setGlobalLoggerProvider(loggerProvider)

  provider.register()
  api.trace.setGlobalTracerProvider(provider)
  api.propagation.setGlobalPropagator(new W3CTraceContextPropagator())

  const sdk = new NodeSDK({
    instrumentations,
  })

  sdk.start()
}

opentelemetry()
