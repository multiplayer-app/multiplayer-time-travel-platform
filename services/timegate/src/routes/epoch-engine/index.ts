import express from 'express'
import { ValidationMiddleware } from '../../middleware'
import listEpoch from './list-epoch'

const { Router } = express
const router = Router({ mergeParams: true })
const { EpochEngineValidationMiddleware } = ValidationMiddleware

router.route('/').get(
  EpochEngineValidationMiddleware.validateListEpochs,
  listEpoch,
)

export default router
