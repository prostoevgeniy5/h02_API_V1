import { client } from "./db"
import { Request } from 'express'
import { ObjectId, WithId, UpdateResult } from "mongodb"
import { PostsType, BloggersType, PostViewModelType } from "./types"
import { postsRepository } from "./posts-repository"
import { getPostsOrBlogsOrUsers } from "./query-repository"

const blogsCollection = client.db('blogspostsvideos').collection<BloggersType>('bloggers')

export const blogsRepository = {
  async getBlogs(): Promise<BloggersType[] | undefined> {
    const result = await blogsCollection.find({}, { projection: { _id: 0 } }).toArray()
    if (result.length > 0) {
      return result
    }
    return undefined
  },

  async getBloggerById(id: string): Promise<BloggersType | null> {

    let result = await blogsCollection.find({ id: id }, { projection: { _id: 0 } }).toArray()
    if (result.length > 0) {
      return result[0]
    } else {
      return null
    }
  },

  async createBlog(obj: BloggersType): Promise<BloggersType | null> {
    let blogId: string = (+(new Date())).toString()
    const newBlogger: BloggersType = {
      id: blogId,
      name: obj.name,
      websiteUrl: obj.websiteUrl,
      description: obj.description,
      createdAt: new Date().toISOString(),
      isMembership: false
    }
    // резульнат содержит insertedId
    let result = await blogsCollection.insertOne(newBlogger)

    const bloger = await blogsRepository.getBloggerById(blogId)

    if (bloger != null) {
      return bloger
    } else {
      return null
    }

  },

  async updateBlog(id: string, obj: BloggersType): Promise<boolean> {
    let result = await blogsCollection.updateOne({ id: id }, { $set: { ...obj } })
    // если обновление успешно result.matchedCount
    return result.matchedCount === 1
  },

  async deleteBlog(id: string, req: Request): Promise<boolean> {
    let postsOfBlogger: PostsType[] = []
    let posts: PostViewModelType | undefined = await getPostsOrBlogsOrUsers.getPosts(req)

    if (posts !== undefined && posts.items.length > 0 ) {
      postsOfBlogger = posts.items.filter(elem => {
        return elem.blogId === id
      })
    }

    if (postsOfBlogger.length > 0) {
      const postsDeletedCount = postsRepository.deletePostsByBlogId(id)
    }
    const result = await blogsCollection.deleteOne({ id: id })

    return result.deletedCount === 1
  }
}