import express from 'express'
import { ValidationMiddleware } from '../../middleware'
import listPersons from './list-persons'

const { Router } = express
const router = Router({ mergeParams: true })
const { MindsOfTimeValidationMiddleware } = ValidationMiddleware


router.route('/').get(
  MindsOfTimeValidationMiddleware.validateListProminentPersons,
  listPersons,
)

export default router
