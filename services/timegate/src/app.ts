import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import { LogLevelString } from 'bunyan'
import restify from 'restify-errors'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import api from './api'
import * as swagger from './swagger'
import { logger, Timer } from './libs'
import { API_PREFIX } from './config'

const { RestError, HttpError } = restify

export const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.connection) {
    return next()
  }

  const reqStart = process.hrtime()

  const url = req.originalUrl || req.url


  logger.info({
    req: {
      method: req.method,
      url,
      // headers: _maskHeaders(req.headers),
      query: req.query,
      // remoteAddress: req.connection.remoteAddress,
      // remotePort: req.connection.remotePort,
    },
  }, `${req.method} ${url}`)

  res.on('finish', () => {
    const statusCode = res.statusCode || 200
    let level: LogLevelString = statusCode < 400 ? 'info' : 'error'

    if (statusCode === 404 && url === '/') {
      return
    } else if (
      statusCode === 404
      || statusCode === 403) {
      level = 'warn'
    }

    // if (statusCode >= 200 && statusCode < 300) {
    //   return
    // }

    logger[level]({
      // res: {
      //   status: statusCode,
      //   headers: res.getHeaders(),
      //   method: req.method,
      // },
      // method: req.method,
      // duration: getDuration(reqStart),
    }, `${req.method} ${url}: ${statusCode} ${Timer.getDuration(reqStart)}ms`)
  })

  next()
})

swagger.init(app)

app.use(API_PREFIX, api)

// eslint-disable-next-line
// @ts-ignore
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('Not found')
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    logger.error(err)
  }

  let statusCode = 502
  let message = 'An error occurred. We are looking into it.'
  let status = 'InternalServerError'

  if (
    err instanceof RestError
    || err instanceof HttpError
  ) {
    statusCode = err.statusCode
    message = err.message
    status = err.code
  }

  return res.status(statusCode).json({
    statusCode,
    message,
    status,
  })
})
