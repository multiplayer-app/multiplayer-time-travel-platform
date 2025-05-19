import type { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { validatorMiddleware } from '../../libs'

export const validatePostOpenrouterMessage = (
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
            body: Joi.object({
                message: Joi.string().required(),
                contextId: Joi.string().uuid(),
            }).required(),
            query: Joi.object({}).required(),
        }),
        { updateQuery: true },
        next,
        req,
    )
}
