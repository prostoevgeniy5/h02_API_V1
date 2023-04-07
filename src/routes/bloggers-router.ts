import {NextFunction, Request, Response, Router } from 'express'
import { blogsService } from '../domain/blogs-servise'
// import {blogsRepository} from '../repositories/blogs-repository'
import { postsRepository } from '../repositories/posts-repository'
import { inputBloggersValidation } from '../midlewares/inputBloggersValidationMiddleware'
import { bodyRequestValidationBlogs } from '../midlewares/blogs-validation'
import { postsService } from '../domain/posts-service'
import { bodyRequestValidationPostsForBlogId } from '../midlewares/posts-validation'
import { getPostsOrBlogsOrUsers } from '../repositories/query-repository'
import { authMidleware } from '../midlewares/authorization-midleware'

  export const bloggersRouter = Router({})

  bloggersRouter.get('/', async (req: Request , res: Response) => {
    const bloggers = await getPostsOrBlogsOrUsers.getBlogs(req)
    if(bloggers !== undefined) {
      return res.status(200).send(bloggers)
    }
    return res.sendStatus(404)
   })
   
  bloggersRouter.get('/:id', async (req: Request , res: Response) => {
     const bloggerItem = await getPostsOrBlogsOrUsers.getBloggerById(req.params.id)
     if (bloggerItem !== null) {
       res.status(200).send(bloggerItem);
     } else {
       res.sendStatus(404)
     }
   })

  bloggersRouter.get('/:id/posts', async (req: Request , res: Response) => {
    
    const postsForBlogId = await postsRepository.getPostsByBlogId(req.params.id, req.query)
    
    if (postsForBlogId !== null) {
      res.status(200).send(postsForBlogId);
    } else {
      res.sendStatus(404)
    }
  })
   
  bloggersRouter.delete('/:id', 
    authMidleware,
    async (req: Request , res: Response) => {
      
      const result = await blogsService.deleteBlog(req.params.id, req)
      if(result) {
        return res.sendStatus(204)
      } else {
        return res.sendStatus(404)
      }
      
    })

  //  const nameBodyValidation = body('name').exists().withMessage('The name field not exist').isString().withMessage('The name field is not string').trim().notEmpty().withMessage('The name field is empty').isLength({ max: 15 }).withMessage('The length of the name field is more 15 characters')
  //  const websiteUrlBodyValidation = body('websiteUrl').exists().withMessage('The websiteUrl field not exist').isString().withMessage('The websiteUrl field is not string').trim().notEmpty().withMessage('The websiteUrl field is empty').isLength({ max: 100 }).withMessage('The length of the websiteUrl field is more 100 characters').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('The websiteUrl field did not pass validation')
  //  const descriptionBodyValidation = body('description').exists().withMessage('The description field not exist').isString().withMessage('The name description is not string').trim().notEmpty().withMessage('The description field is empty').isLength({ max: 500 }).withMessage('The length of the description field is more 500 characters')

  bloggersRouter.post('/', 
  authMidleware,
   // [nameBodyValidation, websiteUrlBodyValidation, descriptionBodyValidation],
   bodyRequestValidationBlogs,
   inputBloggersValidation,
   
   async (req: Request , res: Response) => {
    const newBlogger = await blogsService.createBlog(req.body)
    if(newBlogger) {
      res.status(201).send(newBlogger)
    } else {
      res.sendStatus(404)
    } 
   })

  bloggersRouter.post('/:id/posts', 
  authMidleware,
   // [nameBodyValidation, websiteUrlBodyValidation, descriptionBodyValidation],
   bodyRequestValidationPostsForBlogId,
   inputBloggersValidation,
   
   async (req: Request , res: Response) => {
    const newPost = await postsService.createPostByBlogId(req.params.id, req.body)
    if(newPost) {
      return res.status(201).send(newPost)
    } else if(newPost === null || newPost === undefined) {
      return res.sendStatus(404)
    }
   })
///////////////////////////////////////////////   
  bloggersRouter.put('/:id', 
  authMidleware,
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