import express from 'express'
import { ValidationMiddleware } from '../../middleware'
import postMessage from './post-message'

const { Router } = express
const router = Router({ mergeParams: true })
const { DialogueHubValidationMiddleware } = ValidationMiddleware

router.route('/').get(
  DialogueHubValidationMiddleware.validatePostOpenrouterMessage,
  postMessage,
)

export default router
