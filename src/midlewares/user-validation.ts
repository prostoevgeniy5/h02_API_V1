import { body } from "express-validator"

export const userValidation = [
  // const pattern = new RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")
  body('login').exists().withMessage('The login field not exist').isString().withMessage('The loginOrEmail field is not string').trim().notEmpty().withMessage('The loginOrEmail field is empty').isLength({min: 3, max:10}).withMessage('length must be more than 3 and less than 10 characters').matches(/^[a-zA-Z0-9_-]*$/).withMessage('The login field did not pass validation'),
  body('email').exists().withMessage('The email field not exist').isString().withMessage('The loginOrEmail field is not string').trim().notEmpty().withMessage('The loginOrEmail field is empty').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('The email field did not pass validation'),
  body('password').exists().withMessage('The password field not exist').isString().withMessage('The password field is not string').trim().notEmpty().withMessage('The password field is empty').isLength({min: 6, max:20}).withMessage('length must be more than 6 and less than 20 characters')
]