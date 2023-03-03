import { Sort } from "mongodb"
import { blogsRepository } from "./blogs-repository"
import { client, PostViewModelType} from "./db"
import { PostsType, ReqQueryType, BloggersType } from "./db"

const database = client.db('blogspostsvideos').collection<PostsType>('posts')

export const postsRepository = {
  async getPosts(): Promise<PostsType[] | null>{
    const result = await database.find({},{projection:{_id: 0}}).toArray()
    if(result !== null) {
      return result  
    }
    return null
  },

  async getPostsById(postId: string): Promise<PostsType[] | null>{
    
    const result = await database.find({id: postId}, {projection:{_id: 0}}).toArray()
    if(result) {
      return result
    } else {
      return null
    }
  },

  async createPost(obj: PostsType, objBlogger: BloggersType): Promise<PostsType | null | undefined>{
    // const blogger = await blogsRepository.getBloggerById(obj.blogId)

    if (objBlogger) {
      let name = objBlogger.name
      const newPost: PostsType = {
        id: (+(new Date())).toString(),
        "title": obj.title,
        "shortDescription": obj.shortDescription,
        "content": obj.content,
        "blogId": obj.blogId,
        "blogName": name,
        "createdAt": new Date().toISOString()
      };
      let res = await database.insertOne(newPost)
      console.log('insertedIdres.insertedId', res.insertedId)
      const result = await postsRepository.getPostsById(newPost.id)
      // database.find({id: newPost.id}, {projection: {_id: 0}}).toArray()
      if(result !== null && result.length > 0) {
        return result[0]
      }
      return undefined
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
  },

  async getPostsByBlogId(blogId: string, requestQuery: ReqQueryType): Promise<PostViewModelType | null> {
    const queryObj = requestQuery
    let pagesCount: number, totalCount: number
    let pageNumber: number = queryObj.pageNumber !== undefined ? +queryObj.pageNumber : 1;
    let pageSize: number = queryObj.pageSize !== undefined ? +queryObj.pageSize : 10;
    let skipDocumentsCount: number = (pageNumber - 1) * pageSize
    let sortBy: string = queryObj.sortBy === "createdAt" || queryObj.sortBy === undefined ? "createdAt" : queryObj.sortBy
    let posts: PostsType[] = []
    let sortDir: Sort =queryObj.sortDirection === "desc" || queryObj.sortDirection === undefined ? -1 : 1
    totalCount = await (await database.find({blogId: blogId}, {projection: {_id: 0}}).sort({"createdAt": sortDir}).toArray()).length
    if(totalCount) {
      if(queryObj.sortBy === "createdAt" || queryObj.sortBy === undefined) {
        posts = await database.find({blogId: blogId}, {projection: {_id: 0}}).sort({"createdAt": sortDir}).skip(skipDocumentsCount).limit(pageSize).toArray()
      } else if(queryObj.sortBy === "title") {
        posts = await database.find({blogId: blogId}, {projection: {_id: 0}}).sort({"title": sortDir}).skip(skipDocumentsCount).limit(pageSize).toArray()
      } else if(queryObj.sortBy === "shortDescription") {
        posts = await database.find({blogId: blogId}, {projection: {_id: 0}}).sort({"shortDescription": sortDir}).skip(skipDocumentsCount).limit(pageSize).toArray()
      }  else if(queryObj.sortBy === "content") {
        posts = await database.find({blogId: blogId}, {projection: {_id: 0}}).sort({"content": sortDir}).skip(skipDocumentsCount).limit(pageSize).toArray()
      }      
    }
    if(posts.length > 0) {
      // totalCount = posts.length
      pagesCount = Math.ceil( totalCount / pageSize )
      const resultObject: PostViewModelType = {
        "pagesCount": pagesCount,
        "page": pageNumber,
        "pageSize": pageSize,
        "totalCount": totalCount,
        "items": []

      }
      resultObject.items = posts.map(item => item)
      return resultObject
    }
    return null 
  }
}