import { body } from "express-validator"

const nameBodyValidation = body('name').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 15 }).withMessage('The length of the name field is more 15 characters')
const websiteUrlBodyValidation = body('websiteUrl').exists().withMessage('The websiteUrl field not exist').isString().withMessage('The websiteUrl field is not string').trim().notEmpty().withMessage('The websiteUrl field is empty').isLength({ max: 100 }).withMessage('The length of the websiteUrl field is more 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation')
const descriptionBodyValidation = body('description').exists().withMessage('The description field not exist').isString().withMessage('The name description is not string').trim().notEmpty().withMessage('The description field is empty').isLength({ max: 500 }).withMessage('The length of the description field is more 500 characters')

export const bodyRequestValidationBlogs = [
  nameBodyValidation, websiteUrlBodyValidation, descriptionBodyValidation
]