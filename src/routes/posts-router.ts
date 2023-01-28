import express, { Request, Response, Router, NextFunction } from 'express'
import { db, PostsType, BloggersType } from '../repositories/db'
import { body, check, validationResult, CustomValidator } from 'express-validator'
// import { isNamedExportBindings } from 'typescript'
import { errorsType, errorsDescription, errorFields } from '../midlewares/postsErrorsHandler'

let posts: PostsType[] = db.posts
let bloggers: BloggersType[] = db.bloggers

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

  body('title').isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters'),
  body('shortDescription').isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  body('content').isString().withMessage('must be string').notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
  // (req: Request, res: Response, next: NextFunction) => {

  body('blogId').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom(async (value, { req: Request }) => {
    // const postRequestErrors: errorsType = errorFields();
    // console.log('value', value)
    // console.log('{req:Request}.req.body.blogId',{req:Request}.req.body.blogId)
    let errorBlogId: Error
    try {
      // let errorBlogId: Error = {name: '', message: ''}
      let result: boolean = /^\d+$/.test(value)
      console.log('result', result)
      if (!result) {
        errorBlogId = new Error(JSON.stringify({
          message: "Field blogId not number string ",
          field: "blogId"
        }))
        // return JSON.stringify({
        //   message: "Field blogId not number string ",
        //   field: "blogId"
        // })

        return
      }
      let blogger: BloggersType | undefined = await bloggers.find((item: BloggersType) => +item.id === +value)
      console.log('blogger', blogger)
      result = blogger === undefined ? false : true;
      console.log('result', result)
      if (!blogger) {
        errorBlogId = new Error(JSON.stringify({
          message: "Field blogId not valid. Blogger with blogId are ebsent. ",
          field: "blogId"
        }))
        // return JSON.stringify({
        //   message: "Field blogId not valid. Blogger with blogId are ebsent. ",
        //   field: "blogId"
        // })
        return
      }
      return true
    } catch (errorBlogId) {
      next(errorBlogId)
    }
  }).withMessage("A blogger with such a blogId does not exist"),

  (req: Request, res: Response, next: NextFunction) => {
    const postRequestErrors: errorsType = errorFields();
    const resultErrors = validationResult(req)

    if (!resultErrors.isEmpty()) {
      const length = resultErrors.array().length
      const err = resultErrors.array().filter((elem, ind) => {
        if (ind === 0) {
          return true
        }
        if (ind < length && ind > 0 && resultErrors.array()[ind - 1].param !== elem.param) {
          return true
        } else {
          return false
        }
      })
      err.forEach((elem, _ind) => {
        const obj = {
          "message": elem.msg,
          "field": elem.param
        }
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
      posts.push(newPost);
      res.status(201).json(newPost);
      return
    }

  });

postsRouter.put('/:id',
  body('title').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters'),
  body('shortDescription').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  body('content').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
  body('blogId').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom((value, { req: Request }) => {

    let result: boolean = /^\d+$/.test(value)
    console.log('value', value)
    console.log('resul;t', result)
    if (!result) {
      return true
    }
    let blogger: BloggersType | undefined = bloggers.find((item: BloggersType) => +item.id === +value)
    result = blogger ? true : false;
    return result
  }).withMessage("A blogger with such a blogId does not exist"),

  (req: Request, res: Response) => {
    const putRequestErrors: errorsType = errorFields();
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors.array().forEach((elem, _ind) => {
        const obj = {
          "message": elem.msg,
          "field": elem.param
        }
        putRequestErrors.errorsMessages.push(obj)
      })
      return res.status(400).json(putRequestErrors)
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
          if (blogger) {
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
function next(err: unknown) {
  throw new Error('Function not implemented.')
}

