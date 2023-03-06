import { postsRepository } from "../repositories/posts-repository"
import { Request } from "express"
import { PostsType, BloggersType, PostViewModelType } from "../repositories/db"
import { blogsRepository } from "../repositories/blogs-repository"
import { Sort, SortDirection } from "mongodb"
import { sortQueryItems, SortBy } from "../functions/sortItems-query"

// const database = client.db('blogspostsvideos').collection<PostsType>('posts')

export const postsService = {
  // async getPosts(req: Request): Promise<PostViewModelType | undefined>{
    
  //   const resultObj = await postsRepository.getPosts(req)
  //   if(resultObj !== null) {
  //     return resultObj
  //   }
  //             // const queryObj = obj.query
  //       // const postsResult = await postsRepository.getPostsByBlogId(newPost.blogId, queryObj)
  //       //   if(postsResult !== null) {
  //       //     return postsResult
  //       //   }
     
  //   //}
  //   return undefined
  // },

  // async getPostsById(id: string): Promise<PostsType[] | null>{
  //   const result = await postsRepository.getPostsById(id)
  //   if(result) {
  //   return result
  //   } else {
  //     return null
  //   }
  // },
/////////////////////////////////////////////
  async createPost(obj: Request): Promise<PostsType | null | undefined>{
    const blogger = await blogsRepository.getBloggerById(obj.body.blogId)
    if (blogger) {
      let name = blogger.name
      const newPost: PostsType = {
        id: (+(new Date())).toString(),
        "title": obj.body.title,
        "shortDescription": obj.body.shortDescription,
        "content": obj.body.content,
        "blogId": obj.body.blogId,
        "blogName": name,
        "createdAt": new Date().toISOString()
      };
      const res = await postsRepository.createPost(newPost, blogger)
      if(res !== undefined && res !== null) {
        // const queryObj = obj.query
        // const postsResult = await postsRepository.getPostsByBlogId(newPost.blogId, queryObj)
        //   if(postsResult !== null) {
        //     return postsResult
        //   }
        return res
      } else {
        return null
      }
    } else {
      return undefined
    }
  },
/////////////////////////////////////
  async createPostByBlogId(blogId: string, obj: PostsType): Promise<PostsType | null |undefined> {
    const blogger = await blogsRepository.getBloggerById(blogId)
    if (blogger) {
      let name = blogger.name
      const newPost: PostsType = {
        id: (+(new Date())).toString(),
        "title": obj.title,
        "shortDescription": obj.shortDescription,
        "content": obj.content,
        "blogId": blogId,
        "blogName": name,
        "createdAt": new Date().toISOString()
      };
      let res = await postsRepository.createPost(newPost, blogger)
      if(res !== null) {
        // const result = await postsRepository.getPostsById(newPost.id)
        // if(res !== null) {
          return res
        // }
      } else {
        return null
      }
    } else {
      return undefined
    }
  },

  async updatePost(id: string, obj: PostsType): Promise< boolean | null | undefined>{
    const blogger = await blogsRepository.getBloggerById(obj.blogId)
    if(blogger) {
      const post = await postsRepository.getPostsById(id)
      if(post) {
        const result = await postsRepository.updatePost(id, {...obj})
        return result
      }
    } else {
      return  null
    }
    return undefined
  },

  async deletePost(id: string): Promise<boolean | undefined>{
    const result = await postsRepository.deletePost(id)
    if(result !== undefined) {
      return result
    } else {
      return undefined
    }
  },

  async deletePostsByBlogId(blogid: string): Promise<number | undefined>{
    const result = await postsRepository.deletePostsByBlogId(blogid)
    // result.deletedCount
    if(result !== undefined) {
      return result
    }
    return undefined
  }
}