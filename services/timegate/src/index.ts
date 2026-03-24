import 'dotenv/config'
import './opentelemetry'
import http from 'http'
import { logger } from './libs'
import { app } from './app'
import { 
  OTLP_LOGS_ENDPOINT,
  OTLP_TRACES_ENDPOINT,
  PORT
} from './config'
import * as websocket from './websocket'

const httpServer = http.createServer(app)
const onReady = () => {
  logger.info(`🚀 Server ready at http://localhost:${PORT}`)
  logger.info(`🚀 OTLP Traces Endpoint ${OTLP_TRACES_ENDPOINT}`)
  logger.info(`🚀 OTLP Logs Endpoint ${OTLP_LOGS_ENDPOINT}`)  
}

websocket.start(httpServer)

httpServer.listen(PORT, onReady)

const exitHandler = async (error: Error) => {
  if (error) {
    logger.info('Server exited with error', error)
  }
  process.removeListener('exit', exitHandler)
  process.exit()
}

process.on('exit', exitHandler)
process.on('SIGINT', exitHandler)
process.on('SIGTERM', exitHandler)
process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', err)
})
