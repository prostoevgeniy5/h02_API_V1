import { Request, Response, NextFunction } from "express";
import { ErrorDescription } from "mongodb";

export type errorsDescription = {
    message: string
    field: string
  }
  
export interface errorsType {
    errorsMessages: errorsDescription[]
  }
  
export function errorFields():errorsType {
    return {
      errorsMessages: []
    }
  }

export const postsErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const myErrors = errorFields()
    console.log('err postsErrorHandler', err)
    if(err) {
        const obj: errorsDescription = {
            message: JSON.parse(err.message).message,
            field: JSON.parse(err.message).field
        }
        myErrors.errorsMessages.push(obj)
        res.status(400).json(myErrors)
    }
}
