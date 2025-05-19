import express from 'express'
import {
  health,
  healthz,
  dialogueHub,
  epochEngine,
  mindsOfTime,
  vaultOfTime,
} from './routes'

const { Router } = express
const router = Router()

router.use('/health', health)
router.use('/healthz', healthz)

router.use('/dialogue-hub', dialogueHub)
router.use('/epoch-engine', epochEngine)
router.use('/minds-of-time', mindsOfTime)
router.use('/vault-of-time', vaultOfTime)

export default router
