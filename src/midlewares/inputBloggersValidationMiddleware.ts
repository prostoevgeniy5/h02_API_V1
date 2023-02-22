import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { errorsType, errorFields } from "./postsErrorsHandler";

export const inputBloggersValidation = (req: Request, res: Response, next: NextFunction) => {

    const postRequestErrors: errorsType = errorFields();
     
    const errors = validationResult(req);
    // console.log('errors.array()',errors.array())
    if (!errors.isEmpty()) {
        const length = errors.array().length
        const err = errors.array().filter((elem, ind) => {
        if(ind === 0) {
            return true
        }
        if(ind < length && ind > 0 && errors.array()[ind - 1].param !== elem.param) {
        return true
        } else {
            return false
        }
    })
    err.forEach((elem, ind) => {
      const obj = { 
        "message": elem.msg,
        "field": elem.param}
      postRequestErrors.errorsMessages.push(obj)
    })
        return res.status(400).json(postRequestErrors)
    } 
        return  next()
}

// function errorFields(): errorsType {
//     throw new Error("Function not implemented.");
// }
