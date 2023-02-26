import {NextFunction, Request, Response, Router} from 'express'
// import { BloggersType, client, DbType, PostsType } from '../repositories/db'
import { blogsService } from '../domain/blogs-servise'
import {blogsRepository} from '../repositories/blogs-repository'
// import { body, validationResult, CustomValidator, check } from 'express-validator'
import { inputBloggersValidation } from '../midlewares/inputBloggersValidationMiddleware'
// import { ObjectId } from 'mongodb'
import { bodyRequestValidationBlogs } from '../midlewares/blogs-validation'

// export let bloggers: BloggersType[] = []
// let posts: PostsType[] = []

type ErrorsDescriptionType = {
    message: string
    field: string
  }
  
  interface errorsType {
    errorsMessages: ErrorsDescriptionType[]
  }

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
       res.status(200).send(bloggerItem[0]);
     } else {
       res.sendStatus(404)
     }
   })
   
   bloggersRouter.delete('/:id', async (req: Request , res: Response) => {
    
    const result = await blogsService.deleteBlog(req.params.id)
    if(result) {
      res.sendStatus(204)
      return
    } else {
      res.sendStatus(404)
    }
    return
   })

  //  const nameBodyValidation = body('name').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 15 }).withMessage('The length of the name field is more 15 characters')
  //  const websiteUrlBodyValidation = body('websiteUrl').exists().withMessage('The websiteUrl field not exist').isString().withMessage('The websiteUrl field is not string').trim().notEmpty().withMessage('The websiteUrl field is empty').isLength({ max: 100 }).withMessage('The length of the websiteUrl field is more 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation')
  //  const descriptionBodyValidation = body('description').exists().withMessage('The description field not exist').isString().withMessage('The name description is not string').trim().notEmpty().withMessage('The description field is empty').isLength({ max: 500 }).withMessage('The length of the description field is more 500 characters')

   bloggersRouter.post('/', 
  
   // [nameBodyValidation, websiteUrlBodyValidation, descriptionBodyValidation],
   bodyRequestValidationBlogs,
   inputBloggersValidation,
   
   async (req: Request , res: Response) => {
    const newBlogger = await blogsService.createBlog(req.body)
    res.status(201).send(newBlogger)
    return
   })
///////////////////////////////////////////////   
   bloggersRouter.put('/:id', 

   // [nameBodyValidation, websiteUrlBodyValidation, descriptionBodyValidation],
   bodyRequestValidationBlogs,
   inputBloggersValidation,

    async (req: Request , res: Response) => {
    
    const result = await blogsService.updateBlog(req.params.id, req.body)
    if(result) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(404)
    }
  })