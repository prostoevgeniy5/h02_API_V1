import { body } from 'express-validator'

export const codeConfirmation = body('code').isString().trim().notEmpty().withMessage('field code is not valide')