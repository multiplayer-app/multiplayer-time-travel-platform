import type { NextFunction, Request, Response } from 'express'
import { MindsOfTimeService } from '../../services'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errorRate = req.query.errorRate as number | undefined
    const prominentPersons = await MindsOfTimeService.fetchProminentPersons(errorRate)

    return res.status(200).json(prominentPersons)
  } catch (err) {
    return next(err)
  }
}
