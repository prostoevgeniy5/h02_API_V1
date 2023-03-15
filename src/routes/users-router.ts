import { Request, Response, Router } from 'express'
import bcrypt from 'bcrypt'
import { usersService } from '../domain/users-service'

export const usersRouter = Router({})

usersRouter.post('/', async (req: Request, res: Response) => {
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