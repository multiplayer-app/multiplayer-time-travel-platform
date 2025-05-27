import type { NextFunction, Request, Response } from 'express'
import { UserModel } from '../../models'

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as { email: string }

        await UserModel.findOneAndUpdate(
            { email },
            { email },
            {
                new: true,
                upsert: true,
                projection: { _id: 0, __v: 0 },
            }
        )


        return res.sendStatus(204)
    } catch (err) {
        return next(err)
    }
}
