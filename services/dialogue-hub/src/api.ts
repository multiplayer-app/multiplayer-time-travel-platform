import express from 'express'
import {
  health,
  healthz,
  openrouter
} from './routes'
import { RandomErrorMiddleware } from './middleware'

const { Router } = express
const router = Router()

router.use('/health', health)
router.use('/healthz', healthz)

router.use('/openrouter', RandomErrorMiddleware, openrouter)

export default router
