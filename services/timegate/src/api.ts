import express from 'express'
import {
  health,
  healthz,
  dialogueHub,
  epochEngine,
  mindsOfTime,
  vaultOfTime,
  user
} from './routes'
import { RandomErrorMiddleware } from './middleware'

const { Router } = express
const router = Router()

router.use('/health', health)
router.use('/healthz', healthz)

router.use('/dialogue-hub', RandomErrorMiddleware, dialogueHub)
router.use('/epoch-engine', RandomErrorMiddleware, epochEngine)
router.use('/minds-of-time', RandomErrorMiddleware, mindsOfTime)
router.use('/vault-of-time', RandomErrorMiddleware, vaultOfTime)
router.use('/user', user)

export default router
