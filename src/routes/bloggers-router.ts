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
  
   body('name').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 15 }).withMessage('The length of the name field is more 15 characters'),
   body('websiteUrl').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 100 }).withMessage('The length of the name field is more 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation'),
   body('description').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 500 }).withMessage('The length of the name field is more 500 characters'),
     
    (req: Request , res: Response) => {
    const postRequestErrors: errorsType = errorFields();
     
    const errors = validationResult(req);
    // console.log('errors.array()',errors.array())
      if (!errors.isEmpty()) {
        const length = errors.array().length
        const err = errors.array().filter((elem, ind) => {
          if(ind === 0) {
            return true
          }
          if(ind < length && ind > 0 && errors.array()[ind - 1].param !== elem.param) {
            return true
          } else {
            return false
          }
        })
        err.forEach((elem, ind) => {
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
    body('name').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 15 }).withMessage('The length of the name field is more 15 characters'),
    body('websiteUrl').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 100 }).withMessage('The length of the name field is more 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation'),
    body('description').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 500 }).withMessage('The length of the name field is more 500 characters'),
      
    // body('name').exists().isString().trim().notEmpty().isLength({ max: 15 }).withMessage('The name field did not pass validation'),
    // body('websiteUrl').exists().isString().trim().notEmpty().isLength({ max: 100 }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation'),
    // body('description').exists().isString().trim().notEmpty().isLength({ max: 500 }).withMessage('The description field did not pass validation'),
      
    (req: Request , res: Response) => {
    const resultErrors = validationResult(req)

     let index: number 
     const putRequestErrors = errorFields();
     if (!resultErrors.isEmpty()) {
        const length = resultErrors.array().length
        const err = resultErrors.array().filter((elem, ind) => {
          if(ind === 0) {
            return true
          }
          if(ind < length && ind > 0 && resultErrors.array()[ind - 1].param !== elem.param) {
            return true
          } else {
            return false
          }
        })
        err.forEach((elem, ind) => {
          const obj = { 
            "message": elem.msg,
            "field": elem.param}
          putRequestErrors.errorsMessages.push(obj)
        })
        res.status(400).json(putRequestErrors)
        return 
      }

     let bloggerItem = bloggers.find( (item, ind: number) => {
       if(+item.id === +req.params.id) {
         index = ind
       } return +item.id === +req.params.id })
     if (bloggerItem) {
       let newBloggers = bloggers.map((item, i) => {
         if(index === i) {

          item = Object.assign(item, req.body)
         }
         return item
       })
       bloggers = newBloggers;  
       res.sendStatus(204)
     } else {
       res.sendStatus(404)
     }
   })