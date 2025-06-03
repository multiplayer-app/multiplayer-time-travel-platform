import type { NextFunction, Request, Response } from 'express'
import { VaultOfTimeService } from '../../services'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errorRate = req.query.errorRate as number | undefined
    const historicalEvents = await VaultOfTimeService.fetchHistoricalEvents(errorRate)

    return res.status(200).json(historicalEvents)
  } catch (err) {
    return next(err)
  }
}
