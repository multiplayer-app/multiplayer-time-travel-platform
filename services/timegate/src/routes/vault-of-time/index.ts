import express from 'express'
import { ValidationMiddleware } from '../../middleware'
import listEvents from './list-events'

const { Router } = express
const router = Router({ mergeParams: true })
const { VaultOfTimeValidationMiddleware } = ValidationMiddleware


router.route('/historical-events').get(
  VaultOfTimeValidationMiddleware.validateListEvents,
  listEvents,
)

export default router
