import { MongoClient, ObjectId } from 'mongodb'

const url = 'mongodb://localhost:27018'
// const url = 'mongodb://0.0.0.0:27018/?maxPullSize=20&w=majority'
// const url = 'mongodb+srv://evgeniy_kir:prostoevgeniy5_kir@cluster0.jnxsafb.mongodb.net/?retryWrites=true&w=majority'
console.log('url for db', url)
export const client = new MongoClient(url)

export type DbType = {
  courses: CoursesType[] | []
  videos: Videos[] | []
  posts:PostsType[] | []
  bloggers: BloggersType[] | []
  getPosts: () => PostsType[] | [] 
  getBlogs: ()  => BloggersType[] | []
}

export type Videos = {
    id: number
    _id?: ObjectId
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
}

export type PostsType = {
  id: string
  _id?: ObjectId
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
}

export type BloggersType = {
  id: string
  _id?: ObjectId 
  name: string
  description: string
  websiteUrl: string
}

export type CoursesType = {
  id: number
  _id?: ObjectId
  title: string
}

// export const videosCollection = client.db('blogspostsvideos').collection<Videos>('videos')
export  const bloggersCollection = client.db('blogspostsvideos').collection<BloggersType>('bloggers')
export const postsCollection = client.db('blogspostsvideos').collection<PostsType>('posts')
export const coursesCollection = client.db('blogspostsvideos').collection<CoursesType>('courses')

export const runDb = async () => {
  try{
    // Connect the client to server
    await client.connect()
    // verify connection
    await client.db('blogspostsvideos').command({ping: 1})
    console.log('Connection was successfully to server')
  } catch(error) {
    console.log(' ! Do not connected successfully to server with error ', error)
    await client.close()
  }
  
}