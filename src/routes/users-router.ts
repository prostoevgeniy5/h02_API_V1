import { Request, Response, Router } from 'express'
// simport bcrypt from 'bcrypt'
import { usersService } from '../domain/users-service'
import { userValidation } from '../midlewares/user-validation'
import { inputValidationMiddleware } from '../midlewares/inputValidationMiddleware'
import { getPostsOrBlogsOrUsers } from '../repositories/query-repository'

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
  const result = await getPostsOrBlogsOrUsers.getUsers(req)
  if(result === undefined){
    return res.sendStatus(400)
  } else {
    return res.status(200).json(result)
  }
})

usersRouter.post('/', 
userValidation,
inputValidationMiddleware,
async (req: Request, res: Response) => {
  const users = await usersService.createUser(req.body.login, req.body.email, req.body.password)
  if(users) {
    res.status(201).send(users)
  } else {
    res.status(400).send('Bad rrequest')
  }
})

usersRouter.delete('/:id', async (req: Request, res: Response) => {
  const result = await usersService.deleteUser(req.params.id)
  if(result) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})