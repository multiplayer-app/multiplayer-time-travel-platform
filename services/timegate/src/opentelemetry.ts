import { hostname } from "os"
import { node, NodeSDK } from "@opentelemetry/sdk-node"
import {
  BatchSpanProcessor,
  ParentBasedSampler,
} from "@opentelemetry/sdk-trace-base"
import {
  getNodeAutoInstrumentations,
  getResourceDetectors,
} from "@opentelemetry/auto-instrumentations-node"
import {
  detectResources,
  detectResourcesSync,
  Resource
} from "@opentelemetry/resources"
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
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import {
  SERVICE_NAME,
  SERVICE_VERSION,
  PLATFORM_ENV,
  MULTIPLAYER_OTLP_KEY,
  OTLP_TRACES_ENDPOINT,
  OTLP_LOGS_ENDPOINT,
  MULTIPLAYER_OTLP_DOC_SPAN_RATIO,
  MULTIPLAYER_OTLP_SPAN_RATIO
} from './config'

// NOTE: Update instrumentation configuration as needed
// For more see: https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node
const instrumentations = [
  getNodeAutoInstrumentations({
    "@opentelemetry/instrumentation-http": {
      requestHook: MultiplayerHttpInstrumentationHooks.requestHook({
        headersToMask: ["X-Api-Key"],
        maxPayloadSize: 5000,
        schemifyDocSpanPayload: false,
        maskDebSpanPayload: false,
      }),
      responseHook: MultiplayerHttpInstrumentationHooks.responseHook({
        headersToMask: ["X-Api-Key"],
        maxPayloadSize: 5000,
        schemifyDocSpanPayload: false,
        maskDebSpanPayload: false
      }),
    },
  }),
]

const getResource = () => {
  const resourcesWithDetectors = detectResourcesSync({
    detectors: getResourceDetectors(),
  })
  const resourceWithAttributes = new Resource({
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
  const traceExporter = new MultiplayerHttpTraceExporterNode({
    apiKey: MULTIPLAYER_OTLP_KEY,
    url: OTLP_TRACES_ENDPOINT
  })
  // const traceExporter = new OTLPTraceExporter({
  //   url: OTLP_TRACES_ENDPOINT,
  //   headers: {
  //     Authorization: MULTIPLAYER_OTLP_KEY
  //   },
  // })


  const resource = getResource()

  const provider = new node.NodeTracerProvider({
    resource,
    spanProcessors: [
      new BatchSpanProcessor(traceExporter),
    ],
    sampler: new ParentBasedSampler({
      root: new MultiplayerTraceIdRatioBasedSampler(MULTIPLAYER_OTLP_SPAN_RATIO),
    }),
    idGenerator: new MultiplayerIdGenerator({ autoDocTracesRatio: MULTIPLAYER_OTLP_DOC_SPAN_RATIO }),
  })

  const loggerProvider = new LoggerProvider({
    resource,
  })

  // const logExporter = new MultiplayerHttpLogExporterNode({
  //   apiKey: MULTIPLAYER_OTLP_KEY,
  //   url: OTLP_LOGS_ENDPOINT
  // })
  const logExporter = new OTLPLogExporter({
    url: OTLP_LOGS_ENDPOINT,
    headers: {
      Authorization: MULTIPLAYER_OTLP_KEY
    },
  })

  const logRecordProcessor = new BatchLogRecordProcessor(logExporter)
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
