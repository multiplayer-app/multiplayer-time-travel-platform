import Mongoose, { ConnectOptions } from 'mongoose'
import logger from './logger'
import * as Config from '../config'

const MONGODB_URI_MASKED = Config.MONGODB_URI?.replace(/:\/\/(.*):(.*)@/, '://***:***@')

Mongoose.connection.on('connected', () => {
  logger.info(`[MONGO] Connected to ${MONGODB_URI_MASKED}`)
})

Mongoose.connection.on('error', error => {
  logger.error(error, `[MONGO] Connection to MongoDB failed: ${error.message}`)
})

Mongoose.connection.on('reconnected', () => {
  logger.info(`[MONGO] Reconnected to ${MONGODB_URI_MASKED}`)
})

Mongoose.connection.on('disconnected', () => {
  logger.info(`[MONGO] Disconnected from ${MONGODB_URI_MASKED}`)
})

Mongoose.connection.on('close', () => {
  logger.info(`[MONGO] Connection closed ${MONGODB_URI_MASKED}`)
})

Mongoose.connection.on('reconnectFailed', () => {
  logger.error(`[MONGO] Reconnect Failed ${MONGODB_URI_MASKED}`)
})

const connect = async () => {
  const options: ConnectOptions = {
    autoIndex: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 25000,
    minPoolSize: 3,
  }
  await Mongoose.connect(Config.MONGODB_URI, options)
}

export const connected = () => Mongoose.connection.readyState === 1

const disconnect = async () => {
  if (!connected()) return
  
  await Mongoose.connection.close()
}

export default {
  connect,
  disconnect,
  connected,
}
