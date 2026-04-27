import express from 'express'
import {
  health,
  healthz,
  openrouter
} from './routes'

const { Router } = express
const router = Router()

router.use('/health', health)
router.use('/healthz', healthz)

router.use('/openrouter', openrouter)

export default router
