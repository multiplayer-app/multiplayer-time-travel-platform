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
    }

    validatorMiddleware(
        args,
        Joi.object({
            body: Joi.object({
                message: Joi.string().required(),
                contextId: Joi.string().uuid(),
            }).required(),
        }),
        { updateQuery: true },
        next,
        req,
    )
}
