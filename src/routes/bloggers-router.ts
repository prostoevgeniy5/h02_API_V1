import {NextFunction, Request, Response, Router} from 'express'
import { BloggersType, client, DbType, PostsType } from '../repositories/db'
import {blogsRepository} from '../repositories/blogs-repository'
import { body, validationResult, CustomValidator, check } from 'express-validator'
import { inputBloggersValidation } from '../midlewares/inputBloggersValidationMiddleware'
import { ObjectId } from 'mongodb'

// export let bloggers: BloggersType[] = []
// let posts: PostsType[] = []

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

  bloggersRouter.get('/', async (req: Request , res: Response) => {
    const bloggers = await blogsRepository.getBlogs()
    res.status(200).send(bloggers)
    return
   })
   
   bloggersRouter.get('/:id', async (req: Request , res: Response) => {
     // let bloggerItem = bloggers.find( item => +item.id === +req.params.id )
     const bloggerItem = await blogsRepository.getBloggerById(req.params.id)
     if (bloggerItem !== null && bloggerItem.length > 0 ) {
       res.status(200).send(bloggerItem);
     } else {
       res.sendStatus(404)
     }
   })
   
   bloggersRouter.delete('/:id', async (req: Request , res: Response) => {
    //  let length = bloggers.length
    //    bloggers = bloggers.filter(item => {
    //    return +item.id !== Number.parseInt(req.params.id)
    //  })
     // if(length > bloggers.length) {
    //    res.send(204)
    //  } else if(length === bloggers.length) {
    //    res.send(404)
    //  }
    const result = await blogsRepository.deleteBlog(req.params.id)
    if(result) {
      res.sendStatus(204)
      return
    } else {
      res.sendStatus(404)
    }
    return
   })

   const nameBodyValidation = body('name').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 15 }).withMessage('The length of the name field is more 15 characters')
   const websiteUrlBodyValidation = body('websiteUrl').exists().withMessage('The websiteUrl field not exist').isString().withMessage('The websiteUrl field is not string').trim().notEmpty().withMessage('The websiteUrl field is empty').isLength({ max: 100 }).withMessage('The length of the websiteUrl field is more 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation')
   const descriptionBodyValidation = body('description').exists().withMessage('The description field not exist').isString().withMessage('The name description is not string').trim().notEmpty().withMessage('The description field is empty').isLength({ max: 500 }).withMessage('The length of the description field is more 500 characters')

   bloggersRouter.post('/', 
  
   [nameBodyValidation, websiteUrlBodyValidation, descriptionBodyValidation],
   
   inputBloggersValidation,
   
   async (req: Request , res: Response) => {
    // const postRequestErrors: errorsType = errorFields();
     
    // const errors = validationResult(req);
    // // console.log('errors.array()',errors.array())
    //   if (!errors.isEmpty()) {
    //     const length = errors.array().length
    //     const err = errors.array().filter((elem, ind) => {
    //       if(ind === 0) {
    //         return true
    //       }
    //       if(ind < length && ind > 0 && errors.array()[ind - 1].param !== elem.param) {
    //         return true
    //       } else {
    //         return false
    //       }
    //     })
    //     err.forEach((elem, ind) => {
    //       const obj = { 
    //         "message": elem.msg,
    //         "field": elem.param}
    //       postRequestErrors.errorsMessages.push(obj)
    //     })
    //     return res.status(400).json(postRequestErrors)
    //   }

        //  let blogId: string = (+(new Date())).toString()
        //  const newBlogger: BloggersType  = { 
        //    id: blogId,
        //    name: req.body.name,
        //    websiteUrl: req.body.websiteUrl,
        //    description: req.body.description
        //  }
    //  const newEmpyPostForNewBlogger: PostsType = {
    //   id: blogId,
    //   title: "",
    //   shortDescription: "",
    //   content: "",
    //   blogId: blogId,
    //   blogName: req.body.name
    //  }
    const newBlogger = await blogsRepository.createBlog(req.body)
    
    //  bloggers.push(newBlogger)
    //  posts.push(newEmpyPostForNewBlogger)
    res.status(201).send(newBlogger)
    return
   })
///////////////////////////////////////////////   
   bloggersRouter.put('/:id', 

   [nameBodyValidation, websiteUrlBodyValidation, descriptionBodyValidation],
    // body('name').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 15 }).withMessage('The length of the name field is more 15 characters'),
    // body('websiteUrl').exists().withMessage('The websiteUrl field not exist').isString().withMessage('The websiteUrl field is not string').trim().notEmpty().withMessage('The websiteUrl field is empty').isLength({ max: 100 }).withMessage('The length of the websiteUrl field is more 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation'),
    // body('description').exists().withMessage('The description field not exist').isString().withMessage('The description field is not string').trim().notEmpty().withMessage('The description field is empty').isLength({ max: 500 }).withMessage('The length of the description field is more 500 characters'),
     
    inputBloggersValidation,

    async (req: Request , res: Response) => {
    // const resultErrors = validationResult(req)

    //  let index: number 
    //  const putRequestErrors = errorFields();
    //  if (!resultErrors.isEmpty()) {
    //     const length = resultErrors.array().length
    //     const err = resultErrors.array().filter((elem, ind) => {
    //       if(ind === 0) {
    //         return true
    //       }
    //       if(ind < length && ind > 0 && resultErrors.array()[ind - 1].param !== elem.param) {
    //         return true
    //       } else {
    //         return false
    //       }
    //     })
    //     err.forEach((elem, ind) => {
    //       const obj = { 
    //         "message": elem.msg,
    //         "field": elem.param}
    //       putRequestErrors.errorsMessages.push(obj)
    //     })
    //     res.status(400).json(putRequestErrors)
    //     return 
    //   }
        // let index: number
        // let bloggerItem = bloggers.find( (item, ind: number) => {
        //   if(+item.id === +req.params.id) {
        //      index = ind
        //   } return +item.id === +req.params.id })
        //   if (bloggerItem) {
        //     let newBloggers = bloggers.map((item, i) => {
        //       if( index === i ) {

        //         item = Object.assign(item, req.body)
        //       }
        //       return item
        //     })
        //     bloggers = newBloggers;  
        //     return res.sendStatus(204)
        //   } else {
        //   return res.sendStatus(404)
        // }
    const result = await blogsRepository.updateBlog(req.params.id, req.body)
    if(result) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(404)
    }
  })