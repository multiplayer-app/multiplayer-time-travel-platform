export const NODE_ENV = process.env.NODE_ENV || 'development'
export const isProduction = NODE_ENV === 'production'

export const LOG_LEVEL = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug')
export const PORT = Number(process.env.PORT || 3000)
export const API_PREFIX = process.env.API_PREFIX || '/v0/api'

export const SERVICE_NAME = process.env.npm_package_name?.split('/').pop() as string || process.env.SERVICE_NAME || 'timetravel-nodejs'
export const SERVICE_VERSION = process.env.npm_package_version || '0.0.1'
export const PLATFORM_ENV = process.env.PLATFORM_ENV || "<environment-name>"
export const MULTIPLAYER_OTLP_KEY = process.env.MULTIPLAYER_OTLP_KEY || "<multiplayer-key>"
