import { client } from "./db"
import { ObjectId, WithId, UpdateResult } from "mongodb"
import { PostsType, BloggersType } from "./db"
import { postsRepository } from "./posts-repository"

const blogsCollection = client.db('blogspostsvideos').collection<BloggersType>('bloggers')

export const blogsRepository = {
  async getBlogs(): Promise<BloggersType[]>{
    return await blogsCollection.find({}).toArray()
  },

  async getBloggerById(id: string): Promise<BloggersType[] | null>{
   
      let result = await blogsCollection.find({id: id}).toArray()
      console.log('result.key = ',result.keys, Array.isArray(result))
    if(result) {
      return result
    } else {
      return null
    }
  },

  async createBlog(obj: BloggersType): Promise<BloggersType> {
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
    let result = await blogsCollection.insertOne(newBlogger)
    return newBlogger
  },
  
  async updateBlog(id: string, obj: BloggersType): Promise<boolean>{
    let result = await blogsCollection.updateOne({id : id}, {$set: {...obj}})
    // если обновление успешно result.matchedCount
    return result.matchedCount === 1
  },

  async deleteBlog(id: string): Promise<boolean>{
    const posts = await postsRepository.getPosts()
    console.log('deleteBlog posts',posts)
    const postsOfBlogger = posts.filter(elem => {
      return elem.blogId === id
    })
  
    if(postsOfBlogger.length > 0) {
      const postsDeletedCount = postsRepository.deletePostsByBlogId(id)
    }
    const result = await blogsCollection.deleteOne({id: id})
    return result.deletedCount === 1
  }
}