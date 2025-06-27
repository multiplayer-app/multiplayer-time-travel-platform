export const NODE_ENV = process.env.NODE_ENV || 'development'
export const isProduction = NODE_ENV === 'production'

export const LOG_LEVEL = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug')
export const PORT = Number(process.env.PORT || 3000)
export const API_PREFIX = process.env.API_PREFIX || '/v1/dialogue-hub'

export const SERVICE_NAME = process.env.SERVICE_NAME || process.env.npm_package_name?.split('/').pop() as string || 'dialogue-hub'
export const SERVICE_VERSION = process.env.npm_package_version || '0.0.1'
export const PLATFORM_ENV = process.env.PLATFORM_ENV || "staging"

export const MULTIPLAYER_OTLP_KEY = process.env.MULTIPLAYER_OTLP_KEY || "<multiplayer-key>"
export const OTLP_TRACES_ENDPOINT = process.env.OTLP_TRACES_ENDPOINT || "https://api.multiplayer.app/v1/traces"
export const OTLP_LOGS_ENDPOINT = process.env.OTLP_LOGS_ENDPOINT || "https://api.multiplayer.app/v1/logs"

export const OTLP_MULTIPLAYER_DOC_SPAN_RATIO = process.env.OTLP_MULTIPLAYER_DOC_SPAN_RATIO
    ? Number(process.env.OTLP_MULTIPLAYER_DOC_SPAN_RATIO)
    : 0.02
export const OTLP_MULTIPLAYER_SPAN_RATIO = process.env.OTLP_MULTIPLAYER_SPAN_RATIO
    ? Number(process.env.OTLP_MULTIPLAYER_SPAN_RATIO)
    : 0.01

export const RANDOM_ERROR_RATE = process.env.RANDOM_ERROR_RATE
    ? Number(process.env.RANDOM_ERROR_RATE)
    : 0.1

export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
export const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL
    ? process.env.OPENROUTER_API_URL
    : 'https://openrouter.ai/api/v1/chat/completions'
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL
    ? process.env.OPENROUTER_MODEL
    : 'openai/gpt-3.5-turbo-instruct'


export const REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379'

export const REDIS_DB = process.env.REDIS_DB || 0

export const REDIS_OPENROUTER_CTX_CACHE_PREFIX = 'time-travel-openrouter-ctx:'
