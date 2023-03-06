import { client, BloggersType, PostsType } from "../repositories/db"
import { blogsRepository } from "../repositories/blogs-repository"
import { ObjectId, WithId, UpdateResult } from "mongodb"
import { Request } from 'express'
import { postsRepository } from "../repositories/posts-repository"
// import { PostsType,  } from "./db"
// import { postsRepository } from "./posts-repository"

// const blogsCollection = client.db('blogspostsvideos').collection<BloggersType>('bloggers')

export const blogsService = {
  // async getBlogs(): Promise<BloggersType[]>{
  //   return blogsCollection.find({}, {projection: {_id: 0}}).toArray()
  // },

  // async getBloggerById(id: string): Promise<BloggersType[] | null>{
   
  //     let result = blogsCollection.find({id: id}, {projection:{_id: 0}}).toArray()
  //   if(result) {
  //     return result
  //   } else {
  //     return null
  //   }
  // },

  async createBlog(obj: BloggersType): Promise<BloggersType | null> {
    let blogId: string = (+(new Date())).toString()
     const newBlogger: BloggersType  = { 
       id: blogId,
       name: obj.name,
       websiteUrl: obj.websiteUrl,
       description: obj.description,
       createdAt:	new Date().toISOString(),
       isMembership: false
     }
     // резульнат содержит insertedId
    let result = await blogsRepository.createBlog(newBlogger)
    // const bloger =  await blogsRepository.getBloggerById(blogId)
    
    if(result != null && result != undefined) {
      // console.log('bloger._id === result.insertedId', bloger._id === result.insertedId)
      return result
    } else {
      return null
    }
    
  },
  
  async updateBlog(id: string, obj: BloggersType): Promise<boolean>{
    let result = await blogsRepository.updateBlog(id, obj)
    // если обновление успешно result.matchedCount
    return result
  },

  async deleteBlog(id: string, req: Request): Promise<boolean>{
    const posts = await postsRepository.getPosts(req)
    let postsOfBlogger: PostsType[] = []
    if(posts !== null) {
      const postsOfBlogger = posts.items.filter(elem => {
        return elem.blogId === id
      })
    }
    
    if( postsOfBlogger !== null && postsOfBlogger.length > 0 ) {
      const postsDeletedCount = postsRepository.deletePostsByBlogId(id)
    }
    const result = await blogsRepository.deleteBlog(id, req)
    
    return result
  }
}