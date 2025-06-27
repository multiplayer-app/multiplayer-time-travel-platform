import bunyan, {
    type LoggerOptions,
    type LogLevelString,
} from 'bunyan'
import { hostname } from 'os'
import {
    SERVICE_NAME,
    LOG_LEVEL,
} from '../config'

const HOST_NAME = hostname()

const loggerOptions: LoggerOptions = {
    name: SERVICE_NAME,
    level: LOG_LEVEL as LogLevelString,
    hostname: HOST_NAME,
    serializers: bunyan.stdSerializers,
}

export default bunyan.createLogger(loggerOptions)
