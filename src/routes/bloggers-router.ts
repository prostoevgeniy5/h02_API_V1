import {Request, Response, Router} from 'express'
import { db } from '../repositories/db'

let bloggers = db.bloggers

type ErrorsDescriptionType = {
    message: string
    field: string
  }
  
  interface errorsType {
    errorsMessages: ErrorsDescriptionType[]
  }
  
  function checkRequestBodyField (name: string, field: string): boolean {
    let result = false;
    if(field === 'name'){
      result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 15 ? true : false;
    } else if (field === "websiteUrl") {
      result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 || !/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(name) ? true : false;
    } else if (field === 'title') {
      result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 30 ? true : false;
    } else if (field === 'shortDescription') {
      result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 ? true : false;
    } else if (field === 'content') {
      result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 1000 ? true : false;
    }  else if (field === 'bloggerId') {
      let blogger = bloggers.find(item => +item.id === +name)
      result = typeof +name !== 'number' || !blogger ? true : false;
    } 
    return result
  }
  
  function errorFields():errorsType {
    return {
      errorsMessages: []
    }
  }
  

// export let bloggers = [
//     {"id": 0, "name": "Mark Solonin", "youtubeUrl": "https://www.youtube.com/channel/UChLpUGaZO35ICTltBP50VSg"}, 
//     {"id": 1, "name": "Dmitry Robionek", "youtubeUrl": "https://www.youtube.com/user/ideafoxvideo"},
//     {"id": 2, "name": "Dmitry", "youtubeUrl": "https://www.youtube.com/c/ITKAMASUTRA"}
//   ]

  export const bloggersRouter = Router({})

  bloggersRouter.get('/', (req: Request , res: Response) => {
    res.status(200).send(bloggers)
   })
   
   bloggersRouter.get('/:id', (req: Request , res: Response) => {
     let bloggerItem = bloggers.find( item => item.id === +req.params.id )
     if (bloggerItem) {
       res.status(200).send(bloggerItem);
     } else {
       res.sendStatus(404)
     }
   })
   
   bloggersRouter.delete('/:id', (req: Request , res: Response) => {
     let length = bloggers.length
       bloggers = bloggers.filter(item => {
       return item.id !== Number.parseInt(req.params.id)
     })
     if(length > bloggers.length) {
       res.send(204)
     } else if(length === bloggers.length) {
       res.send(404)
     }
   })
   
   bloggersRouter.post('/', (req: Request , res: Response) => {
     const postRequestErrors = errorFields();
     let name = req.body.name 
       if(checkRequestBodyField(name, 'name')) {
       const errorObj = {message: "You did not send correct data", field: "name"}
       postRequestErrors.errorsMessages.push(errorObj)
       }
       if(checkRequestBodyField(req.body.websiteUrl, 'websiteUrl')) {
         const errorObj = {message: "You did not send correct data", field: "websiteUrl"}
       postRequestErrors.errorsMessages.push(errorObj)
       }
       if(postRequestErrors.errorsMessages.length > 0) {
         res.status(400).send(postRequestErrors)
         return
       }
     const newBlogger = { 
       id: +(new Date()),
       "name": req.body.name,
       "websiteUrl": req.body.youtubeUrl,
       "description": req.body.description
     }
   
     bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
   })
   
   bloggersRouter.put('/:id', (req: Request , res: Response) => {
     let index: number 
     const putRequestErrors = errorFields();
     let bloggerItem = bloggers.find( (item, ind: number) => {
       if(item.id === +req.params.id) {
         index = ind
       } return item.id === +req.params.id })
     if(checkRequestBodyField(req.body.name, 'name')) {
       const errorObj = {message: "You did not send correct data", field: "name"}
       putRequestErrors.errorsMessages.push(errorObj)
       }
       if(checkRequestBodyField(req.body.youtubeUrl, 'youtubeUrl')) {
         const errorObj = {message: "You did not send correct data", field: "youtubeUrl"}
       putRequestErrors.errorsMessages.push(errorObj)
       }
       if(putRequestErrors.errorsMessages.length > 0) {
         res.status(400).send(putRequestErrors)
         return
       }
     if (bloggerItem) {
       let newBloggers = bloggers.map((item, i) => {
         if(index === i) {
           item.name = req.body.name;
           item.websiteUrl = req.body.websiteUrl;
           item.description = req.body.description
         }
         return item
       })
       bloggers = newBloggers;  
       res.sendStatus(204).send('No Content');
     } else {
       res.sendStatus(404)
     }
   })