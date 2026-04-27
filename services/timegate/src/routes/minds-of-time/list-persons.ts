import type { NextFunction, Request, Response } from 'express'
import { MindsOfTimeService } from '../../services'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prominentPersons = await MindsOfTimeService.fetchProminentPersons()

    return res.status(200).json(prominentPersons)
  } catch (err) {
    return next(err)
  }
}
