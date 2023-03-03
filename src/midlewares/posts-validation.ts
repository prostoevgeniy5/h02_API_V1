import { body } from "express-validator";
import { blogsRepository } from "../repositories/blogs-repository";

export const bodyRequestValidationPosts = [
  body('title').isString().trim().notEmpty().isLength({ max: 30 }),
  body('shortDescription').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  body('content').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
  body('blogId').isString().trim().notEmpty().custom(async (value) => {
    const blogs = await blogsRepository.getBlogs()
    if (!blogs) throw new Error()
    const blog = blogs.find(b => b.id === value)
    if(!blog) throw new Error()
    return true                                                                                                                                                   
  }).withMessage('blogId is invalid')
]

export const bodyRequestValidationPostsForBlogId = [
  body('title').isString().trim().notEmpty().isLength({ max: 30 }),
  body('shortDescription').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  body('content').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters')
]

export const bodyRequestValidationPostsUpdate = [
  body('title').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 30 }).withMessage('length must be less than 30 characters'),
  body('shortDescription').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 100 }).withMessage('length must be less than 100 characters'),
  body('content').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').isLength({ max: 1000 }).withMessage('length must be less than 1000 characters'),
  body('blogId').isString().withMessage('must be string').trim().notEmpty().withMessage('must be not empty').custom(async (value) => {
    const blogs = await blogsRepository.getBlogs()
    if(!blogs) throw new Error()
    const blog = blogs.find(b => b.id === value)
    if (!blog) throw new Error()
    return true                                                                                                                                                   
  })
]