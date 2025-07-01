import express from 'express'
import { ValidationMiddleware } from '../../middleware'
import postMessage from './post-message'

const { Router } = express
const router = Router({ mergeParams: true })
const { OpenrouterValidationMiddleware } = ValidationMiddleware

router.route('/message').post(
  OpenrouterValidationMiddleware.validatePostOpenrouterMessage,
  postMessage,
)

export default router
