import type { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { validatorMiddleware } from '../../libs'

export const validateSaveEmail = (
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
                email: Joi.string().email().required(),
            }).required(),
        }),
        { updateQuery: true },
        next,
        req,
    )
}
