import { PostViewModelType, PostsType, BloggersType } from "../repositories/db"
import { postsRepository } from "../repositories/posts-repository"
import { Request } from "express"
import { blogsRepository } from "../repositories/blogs-repository"

export const getPostsOrBlogs = {
  async getPosts(req: Request): Promise<PostViewModelType | undefined>{
    
    const resultObj = await postsRepository.getPosts(req)
    if(resultObj !== null) {
      return resultObj
    }
              // const queryObj = obj.query
        // const postsResult = await postsRepository.getPostsByBlogId(newPost.blogId, queryObj)
        //   if(postsResult !== null) {
        //     return postsResult
        //   }
     
    //}
    return undefined
  },

  async getPostsById(id: string): Promise<PostsType[] | null>{
    const result = await postsRepository.getPostsById(id)
    if(result) {
    return result
    } else {
      return null
    }
  },

  async getBlogs(): Promise<BloggersType[] | undefined>{
    const result = await blogsRepository.getBlogs()
    console.log('result getBlogs', result);
    
    if(result !== undefined) {
      return result
    }
    return undefined
  },

  async getBloggerById(id: string): Promise<BloggersType | null>{
   
      let result = await blogsRepository.getBloggerById(id)
    if(result !== null ) {
      return result
    } else {
      return null
    }
  },
}