import express, { Request, Response, NextFunction } from 'express'
import { videosRouter } from './routes/videos-route'
import { deleteRouter } from './routes/delete-router'
import { authMidleware } from './midlewares/authorization-midleware'
import { postsRouter } from './routes/posts-router'
import { bloggersRouter } from './routes/bloggers-router'

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

app.use('/testing/all-data', deleteRouter)

app.use(parserMiddleware)
app.use(authMidleware)
app.use('/videos', videosRouter)
app.use('/posts', postsRouter)
app.use('/bloggers', bloggersRouter)
app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hello Samurai' })
})

// app.get('/videos', (req: Request, res: Response) => {

//   res.json(db.videos)
// })


// app.get('/videos/:id', (req: Request, res: Response) => {
//   const video = db.videos.find(c => c.id === +req.params.id)

//   if (!video) {
//     res.sendStatus(HTTP_STATUSES.NOT_FOUND)

//     return
//   }
//   res.json(video)
// })

// app.post('/videos/', (req: Request, res: Response) => {
//   const errorsObject: ErrorsType = {"errorsMessages":[]}
//   if (!req.body.title || req.body.title.length > 40 ) {
//     errorsObject.errorsMessages.push({
//       "message": "Bad body data",
//       "field": "title"
//     })
//   }
//   if (!req.body.author || req.body.author.length > 20) {
//     errorsObject.errorsMessages.push({
//       "message": "Bad body data",
//       "field": "author"
//     })
//   }
//   const avaleableResolutionArray = ['P144', 'P240', 'P360', 'P480', 'P720', 'P108', 'P1440', 'P2160']
//   let resolution: string[] = req.body.availableResolutions
//   const result: boolean[] = []
//   resolution.forEach((elem: string, ind: number) => { 
//     result.push(avaleableResolutionArray.includes(elem))
//     })
//   if(result.includes(false)) {
//     errorsObject.errorsMessages.push({
//       "message": "Bad body data",
//       "field": "availableResolutions"
//     })
//   }
//   if (errorsObject.errorsMessages.length > 0) {
//     res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errorsObject)
//     return;
//   }  
  
//   let currentDate = new Date()
//   const day = currentDate.getDate() + 1
//   const dateInMs = currentDate.setDate(day)
//   const date = new Date(dateInMs)

//   let currentDatePlus = new Date(currentDate.setDate(currentDate.getDate()))

//   const createdVideo: Videos = {
//     id: +(new Date()),
//     title: req.body.title,
//     author: req.body.author,
//     canBeDownloaded: false,
//     minAgeRestriction: req.body.minAgeRestriction ? req.body.minAgeRestriction : null,
//     createdAt: new Date().toISOString(),
//     publicationDate: date.toISOString(),
//     availableResolutions: req.body.availableResolutions
//   }
//   db.videos.push(createdVideo)
 
//   res.status(HTTP_STATUSES.CREATED_201).json(createdVideo)
// })

// app.put('/videos/:id', async (req: Request, res: Response) => {
//   let result = await videosRepository.putOrDeleteData(req, res, 'put')
//   if (typeof result === 'undefined') {
//     res.sendStatus(HTTP_STATUSES.NOT_FOUND)
//     return
//   }

//   else if(result && Object.entries(result)[0][0] === 'errorsMessages') {
//     res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result)
//     return
//   } else if( result ) {
//     db.videos.forEach((item, ind) => {
//       if(item.id === +req.params.id) {
//         item = Object.assign(item, result)
        
//       }
//     })
//     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//     return
//   }
// })

// app.delete('/videos/:id', async (req: Request, res: Response) => {
//   const result = await videosRepository.putOrDeleteData(req, res, 'delete')
  
//   if(typeof result === 'undefined') {
//     res.sendStatus(HTTP_STATUSES.NOT_FOUND)
//     return
//   } else if( result ) {
//     db.videos = db.videos.filter((item, ind) => {
//       return item.id !== +req.params.id
//     })
    
//       res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//   }
// })

// app.delete('/testing/all-data', (req, res) => {
//   db.videos = []
//   res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
