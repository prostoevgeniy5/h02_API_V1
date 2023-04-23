import { Request, Response, Router } from 'express'
import { usersService } from '../domain/users-service'
import { jwtService } from './application/jwt-service'
import { inputValidationMiddleware } from '../midlewares/inputValidationMiddleware'
import { loginOrEmailPasswordValidation } from '../midlewares/loginisation-validation'
import { authMidleware, authObjectWithAuthMiddleware } from '../midlewares/authorization-midleware'
import { MeViewModel, UserDBType, UserViewModel } from '../repositories/types'
import { userValidation } from '../midlewares/user-validation'

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
      res.status(200).send({accessToken: token.token})
      // res.sendStatus(204)
    } else {
      res.status(401).send('user no passed checking')
    }
})
/////////////////////////////////////
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
////////////////////////////////////////
authRouter.post('/registration', 
userValidation,
inputValidationMiddleware,
async (req: Request, res: Response) => {
  const result = await usersService.createUser(req.body.login, req.body.email, req.body.password)
  if(!result) {
    return res.status(400).send("Try to register again")
  } else {

    return res.status(204).send("Check your email for confirmation registration")
  }
})
///////////////////////////////////////
