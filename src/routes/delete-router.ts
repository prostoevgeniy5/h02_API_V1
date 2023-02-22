import { Router } from 'express'
import { HTTP_STATUSES } from "../repositories/constants"
import { Videos, PostsType, BloggersType, CoursesType } from "../repositories/db"
import { deleteAllCollections } from '../repositories/deleteAllCollections-repository'
// import { bloggers } from './bloggers-router'
// import { posts } from './posts-router'

export const deleteRouter = Router()
    
deleteRouter.delete('/', async (req, res) => {
  const result = []
    result.push(await deleteAllCollections.deleteVideos())
    result.push(await deleteAllCollections.deletePosts())
    result.push(await deleteAllCollections.deleteBlogs())
    result.push(await deleteAllCollections.deleteCourses())
    // if(result.some(el => el !== null)) {
    // await db.videos.splice(0)
    // await posts.splice(0)
    // await bloggers.splice(0)
    // await db.courses.splice(0)
    // if(db.videos.length === 0 && posts.length === 0 && bloggers.length === 0 &&  db.courses.length === 0) {
    //   console.log('db.posts, db.bloggers, db.videos', db.posts)
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    // } 
    // else {
    //   res.status(HTTP_STATUSES.BAD_REQUEST_400).send('Not all collections have been removed')
    // }
    // }
  
  })