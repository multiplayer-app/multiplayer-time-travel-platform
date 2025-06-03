import type { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { validatorMiddleware } from '../../libs'

export const validatePostOpenrouterMessage = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const args = {
        body: req.body,
        query: req.query
    }

    validatorMiddleware(
        args,
        Joi.object({
            body: Joi.object({
                message: Joi.string().required(),
                contextId: Joi.string().uuid(),
            }).required(),
            query: Joi.object({
                errorRate: Joi.number().min(0).max(1)
            }).required()
        }),
        { updateQuery: true },
        next,
        req,
    )
}
