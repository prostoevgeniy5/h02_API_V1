import { MongoClient, ObjectId, WithId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config()

export type DbType = {
  courses: CoursesType[] | []
  videos: Videos[] | []
  posts:PostsType[] | []
  bloggers: BloggersType[] | []
  getPosts: () => PostsType[] | [] 
  getBlogs: ()  => BloggersType[] | []
}

export type Videos = WithId<{
    _id?: ObjectId
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
}>

export type PostsType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}
 //  _id?: ObjectId
export type BloggersType = {
  id: string 
  name: string
  description: string
  websiteUrl: string
  createdAt:	string
  isMembership: boolean
}

export type CoursesType = {
  id: number
  _id?: ObjectId
  title: string
}

export type ReqQueryType = {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: string
}

export type PostViewModelType = {
  pagesCount:number
  page: number
  pageSize: number
  totalCount:number
  items: PostsType[] | []
}   

// export type  QueryType ={
//   pageNumber: number
//   page: number
//   pageSize: number
//   createdAt: string
//  }

const url = process.env.MONGO_URL

if(!url){
  throw new Error('Url does not found')
}

export const client = new MongoClient(url)

export const runDb = async () => {
  try{
    // Connect the client to server
    await client.connect()
    // verify connection
    // await client.db('blogspostsvideos').command({ping: 1})
    console.log('Connection was successfully to server')
  } catch(error) {
    console.log(' ! Do not connected successfully to server with error ', error)
    await client.close()
  }
  
}