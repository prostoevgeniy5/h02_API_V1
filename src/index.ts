import express, { Request, Response, NextFunction } from 'express'
import { videosRouter } from './routes/videos-route'
import { deleteRouter } from './routes/delete-router'
import { authMidleware } from './midlewares/authorization-midleware'
import { postsRouter } from './routes/posts-router'
import { bloggersRouter } from './routes/bloggers-router'
// import { postsErrorHandler } from './midlewares/postsErrorsHandler'
import { runDb } from './repositories/db'
import { usersRouter } from './routes/users-router'
import { authRouter } from './routes/auth-router'

export const app = express()
const port = process.env.PORT || 3502

const parserMiddleware = express.json()

app.use(parserMiddleware)

app.use('/testing/all-data', deleteRouter)
app.use('/auth', authRouter)
app.use(authMidleware)

app.use('/videos', videosRouter)
app.use('/blogs', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hello Samurai' })
})

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

startApp()