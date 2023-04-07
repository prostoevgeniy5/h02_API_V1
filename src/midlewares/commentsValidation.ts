import { body } from 'express-validator'

export const commentsValidation = (req: Request) => {
  body('content').isString().trim().notEmpty().isLength({min: 20, max: 300}).withMessage('field content is not valide')
}