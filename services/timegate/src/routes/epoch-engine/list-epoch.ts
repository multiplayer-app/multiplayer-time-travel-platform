import type { NextFunction, Request, Response } from 'express'
import { EpochEngineService } from '../../services'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errorRate = req.query.errorRate as number | undefined
    const epochs = await EpochEngineService.fetchEpochs(errorRate)

    return res.status(200).json(epochs)
  } catch (err) {
    return next(err)
  }
}
