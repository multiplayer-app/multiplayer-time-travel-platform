import type { NextFunction, Request, Response } from 'express'
import { VaultOfTimeService } from '../../services'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const historicalEvents = await VaultOfTimeService.fetchHistoricalEvents()

    return res.status(200).json(historicalEvents)
  } catch (err) {
    return next(err)
  }
}
