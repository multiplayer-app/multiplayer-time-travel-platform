import { InvalidArgumentError } from 'restify-errors'
import { NextFunction } from 'express'
import * as Joi from 'joi'

const defaultOptions = {
  abortEarly: true,
  allowUnknown: false,
  convert: true,
}

export const validate = (data: object, schema: Joi.Schema, options = {}) => {
  const _options = { ...defaultOptions, ...options }

  const { error, value } = schema.validate(data, _options)

  if (error) {
    const errMsg = error.details.map((detail) => detail.message).join('. ')

    throw new InvalidArgumentError(errMsg)
  }

  return value
}

export default (
  data: any,
  schema: Joi.Schema,
  options?: any,
  next?: NextFunction,
  req?,
) => {
  try {
    const { updateQuery, ..._options } = options || {}
    const validatedData = validate(data, schema, _options)

    if (
      updateQuery
      && 'query' in validatedData
      && req
    ) {
      req.query = validatedData.query
    }

    if (next) {
      return next()
    }
  } catch (error: any) {
    if (next) {
      next(new InvalidArgumentError(error.message))
    } else {
      throw new InvalidArgumentError(error.message)
    }
  }
}