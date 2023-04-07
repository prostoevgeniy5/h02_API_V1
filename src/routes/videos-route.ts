import {Router, Request, Response, NextFunction} from 'express'
import { ObjectId } from 'mongodb'
import { HTTP_STATUSES } from '../repositories/constants'
import { authMidleware } from '../midlewares/authorization-midleware'
import { videosRepository, Videos, ErrorType, ErrorsType } from '../repositories/videos-repository'

// const videos: Videos[] = db.videos

export const videosRouter = Router()

videosRouter.get('/', async (_req: Request, res: Response) => {
  const result = await videosRepository.getVideos()
    if(result) {
      res.status(200).json(result)
    }
  })

  videosRouter.get('/:id', async (req: Request, res: Response) => {
    const video = await videosRepository.getVideosById(new ObjectId(req.params.id))
      if (!video) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }
    res.status(HTTP_STATUSES.OK_200).json(video)
  })  

  videosRouter.post('/',
  authMidleware,
  async (req: Request, res: Response) => {
    const errorsObject: ErrorsType = {"errorsMessages":[]}
    if (!req.body.title || req.body.title.trim().length > 40 ) {
      errorsObject.errorsMessages.push({
        "message": "Bad body data",
        "field": "title"
      })
    }
    if (!req.body.author || req.body.author.trim().length > 20) {
      errorsObject.errorsMessages.push({
        "message": "Bad body data",
        "field": "author"
      })
    }
    const avaleableResolutionArray = ['P144', 'P240', 'P360', 'P480', 'P720', 'P108', 'P1440', 'P2160']
    let resolution: string[] = req.body.availableResolutions
    const result: boolean[] = []
    resolution.forEach((elem: string, ind: number) => { 
      result.push(avaleableResolutionArray.includes(elem))
      })
    if(result.includes(false)) {
      errorsObject.errorsMessages.push({
        "message": "Bad body data",
        "field": "availableResolutions"
      })
    }
    if (errorsObject.errorsMessages.length > 0) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errorsObject)
      return;
    }      
    // let currentDate = new Date()
    // const day = currentDate.getDate() + 1
    // const dateInMs = currentDate.setDate(day)
    // const date = new Date(dateInMs)
  
    // let currentDatePlus = new Date(currentDate.setDate(currentDate.getDate()))
  
    // const createdVideo: Videos = {
    //   id: +(new Date()),
    //   title: req.body.title,
    //   author: req.body.author,
    //   canBeDownloaded: false,
    //   minAgeRestriction: req.body.minAgeRestriction ? req.body.minAgeRestriction : null,
    //   createdAt: new Date().toISOString(),
    //   publicationDate: date.toISOString(),
    //   availableResolutions: req.body.availableResolutions
    // }
    // videos.push(createdVideo)
    const createdVideo = await videosRepository.createVideo(req.body)
    res.status(HTTP_STATUSES.CREATED_201).json(createdVideo)
  })

  videosRouter.put('/:id',
  authMidleware, 
  async (req: Request, res: Response) => {
    let result = await videosRepository.updateVideosById(new ObjectId(req.params.id), req.body)
    if (!result) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }  
    // else if(result && Object.entries(result)[0][0] === 'errorsMessages') {
    //   res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result)
    //   return
    // } else if( result ) {
    //   db.videos.forEach((item, ind) => {
    //     if(item.id === +req.params.id) {
    //       item = Object.assign(item, result)
          
    //     }
    //   })
    else {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
      return
    }
  })

  videosRouter.delete('/:id',
  authMidleware, 
  async (req: Request, res: Response) => {
    const result = await videosRepository.deleteVideosById(new ObjectId(req.params.id))
    
    if(typeof result === undefined) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    } 
    // else if( result ) {
    //   db.videos = db.videos.filter((item, ind) => {
    //     return item.id !== +req.params.id
    //   })
    else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
  })

  