import { body } from 'express-validator'

export const emailValidation =  body('email').exists().withMessage('The email not exist').isString().withMessage('The email is not string').trim().notEmpty().withMessage('The email data is empty').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('The email did not pass validation')