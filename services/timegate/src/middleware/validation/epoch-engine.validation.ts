import type { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { validatorMiddleware } from '../../libs'

export const validateListEpochs = (
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
            query: Joi.object({}).required(),
        }),
        { updateQuery: true },
        next,
        req,
    )
}
