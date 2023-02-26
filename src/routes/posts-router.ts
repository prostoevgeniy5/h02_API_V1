import express, { Request, Response, Router, NextFunction } from 'express'
import { PostsType, BloggersType } from '../repositories/db'
import { body, check, validationResult, CustomValidator, CustomSanitizer } from 'express-validator'
import { param } from 'express-validator';
import { errorsType, errorsDescription, errorFields } from '../midlewares/postsErrorsHandler'
import { inputValidationMiddleware } from '../midlewares/inputValidationMiddleware';
import { blogsRepository } from '../repositories/blogs-repository';
import { postsRepository } from '../repositories/posts-repository';
import { postsService } from '../domain/posts-service';
import { bodyRequestValidationPosts, bodyRequestValidationPostsUpdate } from '../midlewares/posts-validation';

// export let posts: PostsType[] = []


// const isValidUser: CustomValidator = value => {
//   return User.findUserByEmail(value).then(user => {
//     if (user) {
//       return Promise.reject('E-mail already in use');
//     }
//   });
// };

export const postsRouter = Router({})

postsRouter.get('/', async (_req: Request, res: Response) => {
  const posts = await postsService.getPosts()
  if(posts) {
    res.status(200).json(posts);
  }
  res.sendStatus(404)
});

postsRouter.get('/:id', async (req: Request, res: Response) => {
  let postsItem = await postsService.getPostsById(req.params.id)
  if (postsItem !== null && postsItem.length >0) {
    res.status(200).json(postsItem[0]);
    return
  } else {
    res.sendStatus(404);
    return
  }
});
//////////////////////////////////////////////
postsRouter.post('/',

  // body('title').isString().trim().notEmpty().isLength({ max: 30 }),
  // body('shortDescription').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  // body('content').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
  // body('blogId').isString().trim().notEmpty().custom(async (value) => {
  //   const blogs = await blogsRepository.getBlogs()
  //   const blog = blogs.find(b => b.id === value)
  //   console.log(blog, value, 'custom validator')
  //   if (!blog) throw new Error()
  //   return true                                                                                                                                                   
  // }).withMessage('blogId is invalid'),
  bodyRequestValidationPosts,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    // const blogger = bloggers.find(item => item.id === req.body.blogId)
    // console.log(blogger, 'create post after we find blog');
  
    // if (!blogger) return res.sendStatus(400)
    // const newPost = {
    //   id: (+(new Date())).toString(),
    //   "title": req.body.title,
    //   "shortDescription": req.body.shortDescription,
    //   "content": req.body.content,
    //   "blogId": req.body.blogId,
    //   "blogName": blogger.name
    // };
    // posts.push(newPost);
    const newPost = await postsService.createPost(req.body)
    if(newPost) {
      return res.status(201).json(newPost);
    }
      return res.sendStatus(400)
  });

// const postTitleValidation = body('title').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters')

// const updatePostValidationMiddleware = [postTitleValidation,
// body('shortDescription').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
// body('content').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
// body('blogId').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom(async (value) => {
//   const blogs = await blogsRepository.getBlogs() 
//   const blog = blogs.find(b => b.id === value)
//   if (!blog) throw new Error()
//   return true                                                                                                                                                   
// }),
// param(["postId", "Bad postId of req.params"]).exists().isString().custom((value, {req}) => {

//}) ,
// inputValidationMiddleware]

postsRouter.put('/:postId',
bodyRequestValidationPostsUpdate,
inputValidationMiddleware,
  async (req: Request, res: Response) => {
    
    // const blogger = bloggers.find(item => item.id === req.body.blogId)
    // if (!blogger) return res.sendStatus(400)
    // const post = posts.find(p => p.id === req.params.postId)
    const post = await postsService.updatePost(req.params.postId, req.body)
    if (!post) return res.sendStatus(404)
    // post.title = req.body.title
    // post.shortDescription = req.body.shortDescription;
    // post.content = req.body.content;
    // post.blogId = req.body.blogId
    // post.blogName = blogger.name
    return res.sendStatus(204)
    
  });

postsRouter.delete('/:id', async (req: Request, res: Response) => {
  // let length = posts.length;
  // posts = posts.filter(item => {
  //   return +item.id !== +req.params.id;
  // });
  // if (length > posts.length) {
    const result = await postsService.deletePost(req.params.id)
    if(result) {
    res.sendStatus(204);
    return
  } else {
    res.sendStatus(404);
    return
  }
});
