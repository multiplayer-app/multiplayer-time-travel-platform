import express from 'express'
import { ValidationMiddleware } from '../../middleware'
import saveEmail from './save-email'

const { Router } = express
const router = Router({ mergeParams: true })
const { UserValidationMiddleware } = ValidationMiddleware

router.route('/info/email').post(
  UserValidationMiddleware.validateSaveEmail,
  saveEmail,
)

export default router
