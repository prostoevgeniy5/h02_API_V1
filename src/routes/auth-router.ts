import { Request, Response, Router } from 'express'
import { usersService } from '../domain/authusers-service'
import { jwtService } from './application/jwt-service'
import { inputValidationMiddleware } from '../midlewares/inputValidationMiddleware'
import { loginOrEmailPasswordValidation } from '../midlewares/loginisation-validation'
import { authMidleware, authObjectWithAuthMiddleware } from '../midlewares/authorization-midleware'
import { LoginOrEmailType, MeViewModel, UserDBType, UserViewModel } from '../repositories/types'
import { userValidation } from '../midlewares/user-validation'
import { codeConfirmation } from '../midlewares/codevalidation-confirmregistration'
import { emailValidation } from '../midlewares/email-validation'

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
  const result: UserViewModel | string | undefined | null = await usersService.createUser(req.body.login, req.body.email, req.body.password)
  if(result === undefined) {
    return res.status(400).send("Try to register again")
  }  else if( result !== null && result !== 'email' && result !== 'login'){
    return res.status(204).send("Check your email for confirmation registration")
  } else if(result === 'email') {
    return res.status(400).send(
      {
        errorsMessages: [
          { message: 'user exist' , field: "email" }
        ]})
  } else if(result === 'login') {
    return res.status(400).send(
      {
        errorsMessages: [
          { message: 'user exist' , field: "login" }
        ]})
  }
 
})
///////////////////////////////////////
authRouter.post('/registration-confirmation',
  codeConfirmation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const result = await usersService.confirmEmail(req.body.code)
    if(result === undefined) {
      console.log('80 result auth-router.ts', result)
      return res.status(400).send({ errorsMessages: [{ message: "User no exists or expirean code incorrect", field: "code" }] })
    } else if(result === null) {
      return res.status(400).send({ errorsMessages: [{ message: "The user was retrieved but not updated", field: "code" }] })
    }
     else if(result === false) {
      console.log('86 result auth-router.ts', result)
      return res.status(400).send({ errorsMessages: [{ message: "Expiration data is passed or user is confirmed", field: "code" }] })
    } else if(result) {
      console.log('89 result auth-router.ts', result)
      return res.sendStatus(204)
    }
    console.log('92 result auth-router.ts', result)
  })
  /////////////////////////////////////////////////////
authRouter.post('/registration-email-resending',
  emailValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const result = await usersService.confirmEmailResending(req.body.email)
    if(!result) {
      res.status(400).send('Resending no pass')
    } else {
      res.status(204).send('Resending email successfully.')
    }
  })