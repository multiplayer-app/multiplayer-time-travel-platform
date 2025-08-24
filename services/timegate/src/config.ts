export const NODE_ENV = process.env.NODE_ENV || 'development'
export const isProduction = NODE_ENV === 'production'

export const LOG_LEVEL = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug')
export const PORT = Number(process.env.PORT || 3000)
export const API_PREFIX = process.env.API_PREFIX || '/v1/timegate'

export const SERVICE_NAME = process.env.npm_package_name?.split('/').pop() as string || process.env.SERVICE_NAME || 'timegate'
export const SERVICE_VERSION = process.env.npm_package_version || '0.0.1'
export const PLATFORM_ENV = process.env.PLATFORM_ENV || "staging"

export const MULTIPLAYER_OTLP_KEY = process.env.MULTIPLAYER_OTLP_KEY || "<multiplayer-key>"
export const OTLP_TRACES_ENDPOINT = process.env.OTLP_TRACES_ENDPOINT || "https://api.multiplayer.app/v1/traces"
export const OTLP_LOGS_ENDPOINT = process.env.OTLP_LOGS_ENDPOINT || "https://api.multiplayer.app/v1/logs"

export const DIALOGUE_HUB_SERVICE_URL = process.env.DIALOGUE_HUB_SERVICE_URL || 'http://localhost:3000/v1/dialogue-hub'

export const EPOCH_ENGINE_SERVICE_URL = process.env.EPOCH_ENGINE_SERVICE_URL || 'http://localhost:3000/v1/epoch-engine'

export const MINDS_OF_TIME_SERVICE_URL = process.env.MINDS_OF_TIME_SERVICE_URL || 'http://localhost:3000/v1/minds-of-time'

export const VAULT_OF_TIME_SERVICE_URL = process.env.VAULT_OF_TIME_SERVICE_URL || 'http://localhost:3000/v1/vault-of-time'

export const MULTIPLAYER_OTLP_SPAN_RATIO = process.env.MULTIPLAYER_OTLP_SPAN_RATIO
    ? Number(process.env.MULTIPLAYER_OTLP_SPAN_RATIO)
    : 0.01

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/time-travel-demo'

export const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'mp-time-travel'

export const RANDOM_ERROR_RATE = process.env.RANDOM_ERROR_RATE
  ? Number(process.env.RANDOM_ERROR_RATE)
  : 0.1
