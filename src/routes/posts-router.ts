import express, { Request, Response, Router, NextFunction } from 'express'
import { db, PostsType, BloggersType } from '../repositories/db'
import { body, check, validationResult, CustomValidator, CustomSanitizer } from 'express-validator'
import { param } from 'express-validator';
import { errorsType, errorsDescription, errorFields } from '../midlewares/postsErrorsHandler'
import { inputValidationMiddleware } from '../midlewares/inputValidationMiddleware';

let posts: PostsType[] = db.getPosts()
let bloggers: BloggersType[] = db.getBlogs()

// const isValidUser: CustomValidator = value => {
//   return User.findUserByEmail(value).then(user => {
//     if (user) {
//       return Promise.reject('E-mail already in use');
//     }
//   });
// };

export const postsRouter = Router({})

postsRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json(posts);
});

postsRouter.get('/:id', async (req: Request, res: Response) => {
  let postItem = await posts.find(item => +item.id === +req.params.id);
  if (postItem) {
    res.status(200).json(postItem);
    return
  } else {
    res.sendStatus(404);
    return
  }
});

postsRouter.post('/',

  body('title').isString().trim().notEmpty().isLength({ max: 30 }),
  body('shortDescription').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  body('content').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
  body('blogId').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom(value => {
    const blog = bloggers.find(b => b.id === value)
    if (!blog) throw new Error()
    return true                                                                                                                                                   
  }),
  inputValidationMiddleware,
  (req: Request, res: Response) => {
    const blogger = bloggers.find(item => item.id === req.body.blogId)
    if (!blogger) return res.sendStatus(400)
    const newPost = {
      id: (+(new Date())).toString(),
      "title": req.body.title,
      "shortDescription": req.body.shortDescription,
      "content": req.body.content,
      "blogId": req.body.blogId,
      "blogName": blogger.name
    };
    posts.push(newPost);
    res.status(201).json(newPost);
    return
  });

const postTitleValidation = body('title').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters')

const updatePostValidationMiddleware = [postTitleValidation,
body('shortDescription').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
body('content').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
body('blogId').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom(value => {
  const blog = bloggers.find(b => b.id === value)
  if (!blog) throw new Error()
  return true                                                                                                                                                   
}),
inputValidationMiddleware]

postsRouter.put('/:postId',
updatePostValidationMiddleware,
  (req: Request, res: Response) => {
    
    const blogger = bloggers.find(item => item.id === req.body.blogId)
    if (!blogger) return res.sendStatus(400)
    const post = posts.find(p => p.id === req.params.postId)
    if (!post) return res.sendStatus(404)
    post.title = req.body.title
    post.shortDescription = req.body.shortDescription;
    post.content = req.body.content;
    post.blogId = req.body.blogId
    post.blogName = blogger.name
    res.sendStatus(204)
    
  });

postsRouter.delete('/:id', (req: Request, res: Response) => {
  let length = posts.length;
  posts = posts.filter(item => {
    return +item.id !== +req.params.id;
  });
  if (length > posts.length) {
    res.sendStatus(204);
    return
  } else {
    res.sendStatus(404);
    return
  }
});
