import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";


export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const validation = validationResult(req)
    if (!validation.isEmpty()) {
        const errors = validation.array({onlyFirstError: true })
        return res.status(400).send({'errorsMessages': errors.map(e => ({
            message: e.msg,
            field: e.param
        }))})
    }
    return next()
}
