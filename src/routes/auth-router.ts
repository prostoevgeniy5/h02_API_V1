import { Request, Response, Router } from 'express'
import { usersService } from '../domain/users-service'
import { jwtService } from './application/jwt-service'
import { inputValidationMiddleware } from '../midlewares/inputValidationMiddleware'
import { loginOrEmailPasswordValidation } from '../midlewares/loginisation-validation'
import { authMidleware, authObjectWithAuthMiddleware } from '../midlewares/authorization-midleware'
import { MeViewModel, UserDBType, UserViewModel } from '../repositories/types'

export const authRouter =  Router({})

authRouter.post('/login',
  // authMidleware,
  loginOrEmailPasswordValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(
      req.body.loginOrEmail, req.body.password 
      )
      console.log('19 auth-router.ts user', user)
    if(user) {
      const token = await jwtService.createJWT(user)
      console.log('20 auth-router.ts token', token.token)
      res.status(201).send(token.token)
      // res.sendStatus(204)
    } else {
      res.status(401).send('user no rassed checking')
    }
})

authRouter.get('/me',
  authObjectWithAuthMiddleware.authMidleware,
  async (req:Request, res: Response) => {

    let user: MeViewModel = {
      userId: authObjectWithAuthMiddleware.user.id,
      login: authObjectWithAuthMiddleware.user.login,
      email: authObjectWithAuthMiddleware.user.email
    }
    if(user.userId) {
      return res.status(200).send(user)
    } else {
      return res.status(401).send('You do not authorised')
    }
  }
)