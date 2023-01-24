import {NextFunction, Request, Response, Router} from 'express'
import { BloggersType, db } from '../repositories/db'
import { body, validationResult, CustomValidator, check } from 'express-validator'

let bloggers = db.bloggers

type ErrorsDescriptionType = {
    message: string
    field: string
  }
  
  interface errorsType {
    errorsMessages: ErrorsDescriptionType[]
  }

// type ErrorsFromValidationResultObject = {
//   msg: string
//   param: string
//   value: string
//   // Location of the param that generated this error.
//   // It's either body, query, params, cookies or headers.
//   location: string

//   // nestedErrors only exist when using the oneOf function
//   nestedErrors?: Object[]
// }
  
  function checkRequestBodyField (name: string): boolean {
    let result = false;
    switch(name) {
      case 'name':
      console.log(' in check of name')
      body(name).exists().isString().notEmpty().isLength({ max: 15 }).withMessage('length must be less than 15 characters')
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 15 ? true : false;
      break
      case "websiteUrl":
      body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 || !/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(name) ? true : false;
      console.log(' in body of webSiteUrl')
      break
      case 'title':
      body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters')
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 30 ? true : false;
      break
      case 'content':
        console.log(' in body of content')
      body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters')
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 30 ? true : false;
      break
      case 'shortDescription':
      body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters')
      // result = name === undefined || typeof name !== 'string' || name.trim() === '' || name.length > 100 ? true : false;
      break
      case 'description':
        body(name).exists().withMessage(`The field ${name} not exist`).isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 500 }).withMessage('length must be less than 500 characters')
      break
    }
    return result
  }
  
  function errorFields():errorsType {
    return {
      errorsMessages: []
    }
  }

  export const bloggersRouter = Router({})

  bloggersRouter.get('/', (req: Request , res: Response) => {
    res.status(200).send(bloggers)
   })
   
   bloggersRouter.get('/:id', (req: Request , res: Response) => {
     let bloggerItem = bloggers.find( item => +item.id === +req.params.id )
     if (bloggerItem) {
       res.status(200).send(bloggerItem);
     } else {
       res.sendStatus(404)
     }
   })
   
   bloggersRouter.delete('/:id', (req: Request , res: Response) => {
     let length = bloggers.length
       bloggers = bloggers.filter(item => {
       return +item.id !== Number.parseInt(req.params.id)
     })
     if(length > bloggers.length) {
       res.send(204)
     } else if(length === bloggers.length) {
       res.send(404)
     }
   })
   
   bloggersRouter.post('/', 
  
   body('name').exists().isString().trim().notEmpty().isLength({ max: 15 }).withMessage('The name field did not pass validation'),
   body('websiteUrl').exists().isString().trim().notEmpty().isLength({ max: 100 }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation'),
   body('description').exists().isString().trim().notEmpty().isLength({ max: 500 }).withMessage('The description field did not pass validation'),
     
    (req: Request , res: Response) => {
    const postRequestErrors: errorsType = errorFields();
     
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((elem, ind) => {
          const obj = { 
            "message": elem.msg,
            "field": elem.param}
          postRequestErrors.errorsMessages.push(obj)
        })
        return res.status(400).json(postRequestErrors)
      }
     let blogId: string = (+(new Date())).toString()
     const newBlogger: BloggersType  = { 
       id: blogId,
       name: req.body.name,
       websiteUrl: req.body.websiteUrl,
       description: req.body.description
     }
     bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
   })
   
   bloggersRouter.put('/:id', 

    body('name').exists().isString().trim().notEmpty().isLength({ max: 15 }).withMessage('The name field did not pass validation'),
    body('websiteUrl').exists().isString().trim().notEmpty().isLength({ max: 100 }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation'),
    body('description').exists().isString().trim().notEmpty().isLength({ max: 500 }).withMessage('The description field did not pass validation'),
      
    (req: Request , res: Response) => {
    const resultValue = validationResult(req)

     let index: number 
     const putRequestErrors = errorFields();
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         errors.array().forEach((elem, ind) => {
           const obj = { 
             "message": elem.msg,
             "field": elem.param}
           putRequestErrors.errorsMessages.push(obj)
         })
         res.status(400).json(putRequestErrors)
         return
         // return res.status(400).json({ errors: errors.array() });
       }

     let bloggerItem = bloggers.find( (item, ind: number) => {
       if(+item.id === +req.params.id) {
         index = ind
       } return +item.id === +req.params.id })
     if (bloggerItem) {
       let newBloggers = bloggers.map((item, i) => {
         if(index === i) {
          //  item.name = req.body.name;
          //  item.websiteUrl = req.body.websiteUrl;
          //  item.description = req.body.description
          Object.assign(item, req.body)
         }
         return item
       })
       bloggers = newBloggers;  
       res.sendStatus(204)
     } else {
       res.sendStatus(404)
     }
   })