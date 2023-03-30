import { Request, Response, Router } from 'express'
import { usersService } from '../domain/users-service'
import { jwtService } from './application/jwt-service'
import { inputValidationMiddleware } from '../midlewares/inputValidationMiddleware'
import { loginOrEmailPasswordValidation } from '../midlewares/loginisation-validation'

export const authRouter =  Router({})

authRouter.post('/login', 
loginOrEmailPasswordValidation,
inputValidationMiddleware,
async (req: Request, res: Response) => {
  const user = await usersService.checkCredentials(
    req.body.loginOrEmail, req.body.password 
    )
  if(user) {
    const token = await jwtService.createJWT(user)
    res.status(201).send(token)
    // res.sendStatus(204)
  } else {
    res.sendStatus(401)
  }
})