import { blogsRepository } from "./blogs-repository"
import { client } from "./db"
import { PostsType, BloggersType } from "./db"

const database = client.db('blogspostsvideos').collection<PostsType>('posts')

export const postsRepository = {
  async getPosts(): Promise<PostsType[]>{
    const result =  database.find({}).toArray()
    return result
  },

  async getPostsById(id: string): Promise<PostsType[] | null>{
    if(id) {
      const result =  database.find({id: id}).toArray()
      return result
    } else {
      return null
    }
  },

  async createPost(obj: PostsType): Promise<PostsType | null>{
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
      let res = database.insertOne(newPost)
      
      const result = await database.find({id: newPost.id}, {projection: {_id: 0}}).toArray()
      return result[0]
    } else {
      return null
    }
  },

  async updatePost(id: string, obj: PostsType): Promise< boolean | null | undefined>{
    const blogger = await blogsRepository.getBloggerById(obj.blogId)
    if(blogger) {
      const post = await postsRepository.getPostsById(id)
      if(post) {
        const result = await database.updateOne({id: id}, {$set: {...obj}})
        return result.matchedCount === 1
      }
    } else {
      return  null
    }
    return undefined
  },

  async deletePost(id: string): Promise<boolean | undefined>{
    const result = await database.deleteOne({id: id})
    return result.deletedCount === 1
  },

  async deletePostsByBlogId(blogid: string): Promise<number | undefined>{
    const result = await database.deleteMany({blogId: blogid})
    // result.deletedCount
    return result.deletedCount
  }
}