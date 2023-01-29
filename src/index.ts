import express, { Request, Response, NextFunction } from 'express'
import { videosRouter } from './routes/videos-route'
import { deleteRouter } from './routes/delete-router'
import { authMidleware } from './midlewares/authorization-midleware'
import { postsRouter } from './routes/posts-router'
import { bloggersRouter } from './routes/bloggers-router'
import { postsErrorHandler } from './midlewares/postsErrorsHandler'

export const app = express()
const port = process.env.PORT || 3500

// export const HTTP_STATUSES = {
//   OK_200: 200,
//   CREATED_201: 201,
//   NO_CONTENT_204: 204,

//   BAD_REQUEST_400: 400,
//   NOT_FOUND: 404
// }

const parserMiddleware = express.json()

app.use(parserMiddleware)
app.use('/testing/all-data', deleteRouter)
app.use(authMidleware)
app.use('/videos', videosRouter)
app.use('/posts', postsRouter)
app.use('/blogs', bloggersRouter)
app.use(postsErrorHandler)
app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hello Samurai' })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
