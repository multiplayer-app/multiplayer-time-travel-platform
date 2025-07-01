import * as redis from 'redis'
import type { RedisClientType, SetOptions } from 'redis'
import logger from './logger'
import {
  REDIS_URI as _REDIS_URI,
//   REDIS_DB,
} from '../config'

export const REDIS_URI = _REDIS_URI

const REDIS_URI_MASKED = REDIS_URI?.replace(/:\/\/(.*):(.*)@/, '://***:***@')

export type RedisClient = RedisClientType<any, any, any>

let client: RedisClient
let clientForSubscriptions: RedisClient

export const createClient = (redisUri?: string) => {
  const _client = redis.createClient({
    url: redisUri || REDIS_URI,
  })
    .on(
      'error',
      err => logger.error(err, '[REDIS] Redis Client Error'),
    )

  return _client
}

export const connect = async () => {
  try {
    if (!client) {
      client = createClient()
    }

    if (!client.isReady && !client.isOpen) {
      logger.info(`[REDIS] Trying to connect ${REDIS_URI_MASKED}`)
      await client.connect()

      logger.info(`[REDIS] Connected to ${REDIS_URI_MASKED}`)
    }

    return client
  } catch (error: any) {
    if (!error.stack) {
      throw new Error(error)
    }

    throw error
  }
}

export const disconnect = async () => {
  if (client) {
    await client.disconnect()
    logger.info(`[REDIS] Disconnected from ${REDIS_URI_MASKED}`)
  }
}

export const get = async (key: string) => {
  try {
    const value = await client.get(key)

    if (
      value?.startsWith('{')
      || value?.startsWith('[')
    ) {
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    } else {
      return value
    }
  } catch (error: any) {
    if (!error.stack) {
      throw new Error(error)
    }

    throw error
  }
}

export const set = async (
  key: string,
  value: any,
  expireInSeconds?: number,
  customOptions?: SetOptions,
) => {
  try {
    const _value = typeof value === 'object'
      ? JSON.stringify(value)
      : value

    const options: SetOptions = customOptions || {}

    if (expireInSeconds) {
      options.EX = expireInSeconds
    }

    return client.set(
      key,
      _value,
      options,
    )
  } catch (error: any) {
    if (!error.stack) {
      throw new Error(error)
    }

    throw error
  }
}

export default {
  connect,
  disconnect,
  createClient,
  get,
  set,
}
