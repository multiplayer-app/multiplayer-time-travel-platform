import type { NextFunction, Request, Response } from 'express'
import { DialogueHubService } from '../../services'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      message,
      contextId
    } = req.body as { message: string, contextId?: string }

    const reply = await DialogueHubService.postOpenRouterMessage(message, contextId)

    return res.status(200).json(reply)
  } catch (err) {
    return next(err)
  }
}
