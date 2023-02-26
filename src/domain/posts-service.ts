

import { postsRepository } from "../repositories/posts-repository"
// import { client } from "./db"
import { PostsType, BloggersType } from "../repositories/db"
import { blogsRepository } from "../repositories/blogs-repository"

// const database = client.db('blogspostsvideos').collection<PostsType>('posts')

export const postsService = {
  async getPosts(): Promise<PostsType[] | undefined>{
    const result = await postsRepository.getPosts()
    if(result) {
      return result
    }
    return []
  },

  async getPostsById(id: string): Promise<PostsType[] | null>{
    const result = await postsRepository.getPostsById(id)
    if(result) {
    return result
    } else {
      return null
    }
  },

  async createPost(obj: PostsType): Promise<PostsType | null | undefined>{
    const blogger = await blogsRepository.getBloggerById(obj.blogId)
    if (blogger) {
      let name = blogger[0].name
      const newPost: PostsType = {
        id: (+(new Date())).toString(),
        "title": obj.title,
        "shortDescription": obj.shortDescription,
        "content": obj.content,
        "blogId": obj.blogId,
        "blogName": name,
        "createdAt": new Date().toISOString()
      };
      let res = await postsRepository.createPost(newPost)
      if(res !== null) {
        const result = await postsRepository.getPostsById(newPost.id)
        if(result !== null) {
          return result[0]
        }
      }
      else {
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