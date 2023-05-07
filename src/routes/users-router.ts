import { Request, Response, Router } from 'express'
// simport bcrypt from 'bcrypt'
import { usersService } from '../domain/authusers-service'
import { userValidation } from '../midlewares/user-validation'
import { inputValidationMiddleware } from '../midlewares/inputValidationMiddleware'
import { getPostsOrBlogsOrUsers } from '../repositories/query-repository'
import { authMidleware } from '../midlewares/authorization-midleware'

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
  const result = await getPostsOrBlogsOrUsers.getUsers(req)
  if(result === undefined){
    return res.sendStatus(404)
  } else {
    return res.status(200).json(result)
  }
})

usersRouter.post('/', 
authMidleware,
userValidation,
inputValidationMiddleware,
async (req: Request, res: Response) => {
  const users = await usersService.createUser(req.body.login, req.body.email, req.body.password, 'usersEndpoint')
  if(users === 'login' || users === 'email') {
    res.status(400).send('User already exists')
    return
  }
  if(users) {
    res.status(201).send(users)
  } else {
    res.status(400).send('Bad rrequest')
  }
})

usersRouter.delete('/:id', 
authMidleware,
async (req: Request, res: Response) => {
  const result = await usersService.deleteUser(req.params.id)
  if(result) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})