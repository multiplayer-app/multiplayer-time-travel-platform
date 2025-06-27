import expressJSDocSwagger, { Options as SwaggerOptions } from 'express-jsdoc-swagger'
import { logger } from './libs'
import { readFileSync } from 'fs'
import path from 'path'
import {
  API_PREFIX,
  PORT,
} from './config'

const swaggerDoc = JSON.parse(readFileSync(path.join(__dirname, '../doc/swagger.json'), 'utf-8'))

const swaggerOptions: SwaggerOptions = {
  info: {
    version: process.env.npm_package_version as string,
    title: process.env.npm_package_name as string,
  },
  security: {},
  filesPattern: './**/*.ts',
  baseDir: '.',
  swaggerUIPath: path.join(API_PREFIX, 'docs'),
}

export const init = (app) => {
  expressJSDocSwagger(app)(swaggerOptions, swaggerDoc)

  logger.info(
    `Swagger endpoint: http://localhost:${PORT}${swaggerOptions.swaggerUIPath}`,
  )
}
