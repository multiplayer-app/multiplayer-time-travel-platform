import type { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { validatorMiddleware } from '../../libs'

export const validateListEvents = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const args = {
        query: req.query,
        params: req.params,
    }

    validatorMiddleware(
        args,
        Joi.object({
            params: Joi.object({}).required(),
            query: Joi.object({
                errorRate: Joi.number().min(0).max(1)
            }).required()
        }),
        { updateQuery: true },
        next,
        req,
    )
}
