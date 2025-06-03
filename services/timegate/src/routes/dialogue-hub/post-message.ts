import type { NextFunction, Request, Response } from 'express'
import { DialogueHubService } from '../../services'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      message,
      contextId
    } = req.body as { message: string, contextId?: string }
    const errorRate = req.query.errorRate as number | undefined

    const reply = await DialogueHubService.postOpenRouterMessage(
      message,
      contextId,
      errorRate
    )

    return res.status(200).json(reply)
  } catch (err) {
    return next(err)
  }
}
