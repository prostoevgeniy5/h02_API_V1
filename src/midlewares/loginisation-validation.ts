import { body } from "express-validator"

export const loginOrEmailPasswordValidation = [
  // const pattern = new RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")
  body('loginOrEmail').exists().withMessage('The loginOrEmail field not exist').isString().withMessage('The loginOrEmail field is not string').trim().notEmpty().withMessage('The loginOrEmail field is empty'),
  body('password').exists().withMessage('The password field not exist').isString().withMessage('The password field is not string').trim().notEmpty().withMessage('The password field is empty')
]