import { Request, Response, Router } from 'express'
// import {bloggers} from './bloggers-router'
import { db, PostsType, BloggersType } from '../repositories/db'
import { body, validationResult, CustomValidator } from 'express-validator'

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
  res.status(200).send(posts);
});

postsRouter.get('/:id', (req: Request, res: Response) => {
  let postItem = posts.find(item => +item.id === +req.params.id);
  if (postItem) {
    // let blogger = checkRequestBodyField(postItem.blogId.toString(), 'blogId')
    const blogger = bloggers.find((elem, ind) => {
      return 
    })
    if (!blogger) {
      res.status(200).send(postItem);
    } else {
      res.status(400).send('Bad Request')
    }
  } else {
    res.sendStatus(404);
  }
});

postsRouter.post('/', 
  body('title').isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters'),
  body('shortDescription').isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  body('content').isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
  body('blogId').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom((name) => {
    let blogger: BloggersType | undefined = bloggers.find((item: BloggersType) => +item.id === +name)
    const result = typeof +name !== 'number' || !blogger ? true : false;
    return result
  }).withMessage("A blogger with such a bloggerid does not exist"),
  
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
    posts.push(newPost);
    res.status(201).send(newPost);
  }

});

postsRouter.put('/:id', (req: Request, res: Response) => {
  let index: number;
  // const putRequestErrors = errorFields();
  let postItem = posts.find((item, ind) => {
    if (+item.id === +req.params.id) {
      index = ind;
    }
    return +item.id === +req.params.id;
  });
  
  const putRequestErrors = validationResult(req)
  if (putRequestErrors.array.length > 0) {
    res.status(400).send(putRequestErrors.array);
    return;
  }
  if (postItem) {
    posts = posts.map((item, i) => {
      if (index === i) {
        item.title = req.body.title
        item.shortDescription = req.body.shortDescription;
        item.content = req.body.content;
        item.blogId = req.body.blogId
      }
      return item;
    });
    res.sendStatus(204).send('No Content');
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
    res.send(204);
  } else {
    res.send(404);
  }
});
function res(error?: any): void {
  throw new Error('Function not implemented.')
}

