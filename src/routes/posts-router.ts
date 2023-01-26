import { Request, Response, Router } from 'express'
import { db, PostsType, BloggersType } from '../repositories/db'
import { body,check, validationResult, CustomValidator } from 'express-validator'

let posts: PostsType[] = db.posts
let bloggers: BloggersType[] = db.bloggers

type errorsDescription = {
  message: string
  field: string
}

interface errorsType {
  errorsMessages: errorsDescription[]
}

function errorFields():errorsType {
  return {
    errorsMessages: []
  }
}

export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
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
  body('title').isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters'),
  body('shortDescription').isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  body('content').isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
  check('blogId').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom((value, { req: Request }) => {
    let blogger: BloggersType | undefined = bloggers.find((item: BloggersType) => +item.id === +value)
    const result =  blogger ? true : false;
    return result
  }).withMessage("A blogger with such a blogId does not exist"),
  
  (req: Request, res: Response) => {
    const postRequestErrors: errorsType = errorFields();
    const errors = validationResult(req)
    console.log('errors', errors)
    if (!errors.isEmpty()) {
      errors.array().forEach((elem, ind) => {
        const obj = { 
          "message": elem.msg,
          "field": elem.param}
        postRequestErrors.errorsMessages.push(obj)
      })
      res.status(400).json(postRequestErrors)
      return
    }

    let blogger = bloggers.find(item => +item.id === +req.body.blogId)
    let newPost
    if (blogger) {
      newPost = {
        id: (+(new Date())).toString(),
        "title": req.body.title,
        "shortDescription": req.body.shortDescription,
        "content": req.body.content,
        "blogId": req.body.blogId,
        "blogName": blogger.name
      };
      db.posts.push(newPost);
      res.status(201).json(newPost);
      return
    }

});

postsRouter.put('/:id',
  body('title').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters'),
  body('shortDescription').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  body('content').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
  check('blogId').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom((value, { req: Request }) => {
    let blogger: BloggersType | undefined = bloggers.find((item: BloggersType) => +item.id === +value)
    const result =  blogger ? true : false;
    return result
  }).withMessage("A blogger with such a blogId does not exist"),
  
(req: Request, res: Response) => {
  const postRequestErrors: errorsType = errorFields();
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors.array().forEach((elem, ind) => {
      const obj = { 
        "message": elem.msg,
        "field": elem.param}
      postRequestErrors.errorsMessages.push(obj)
    })
    return res.status(400).json(postRequestErrors)
  }
  let index: number;
  let blogger = bloggers.find(item => +item.id === +req.body.blogId)
  let postItem = posts.find((item, ind) => {
    if (+item.id === +req.params.id) {
      index = ind;
    }
    return +item.id === +req.params.id;
  });

  if (postItem && blogger) {
    posts = posts.map((item, i) => {
      if (index === i) {
        if(blogger) {
          item.title = req.body.title
          item.shortDescription = req.body.shortDescription;
          item.content = req.body.content;
          item.blogId = req.body.blogId
          item.blogName = blogger.name
        }
      }
      return item;
    });
    res.status(204).send('No Content');
  }
  else {
    res.sendStatus(404);
  }
});

postsRouter.delete('/:id', (req: Request, res: Response) => {
  let length = posts.length;
  posts = posts.filter(item => {
    return +item.id !== Number.parseInt(req.params.id);
  });
  if (length > posts.length) {
    res.sendStatus(204);
    return
  } else {
    res.sendStatus(404);
    return
  }
});
// function res(error?: any): void {
//   throw new Error('Function not implemented.')
// }

