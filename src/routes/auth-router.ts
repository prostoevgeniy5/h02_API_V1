import { Request, Response, Router } from 'express'
import { usersService } from '../domain/users-service'
import { inputValidationMiddleware } from '../midlewares/inputValidationMiddleware'
import { loginOrEmailPasswordValidation } from '../midlewares/loginisation-validation'

export const authRouter =  Router({})

authRouter.post('/login', 
loginOrEmailPasswordValidation,
inputValidationMiddleware,
async (req: Request, res: Response) => {
  const result = await usersService.checkCredentials(
    req.body.loginOrEmail, req.body.password 
    )
  if(result) {
    res.sendStatus(204)
  } else {
    res.sendStatus(401)
  }
})