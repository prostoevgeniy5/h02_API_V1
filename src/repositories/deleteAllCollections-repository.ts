import {client} from './db'

const database = client.db('blogspostsvideos')

export const deleteAllCollections = {
  async deleteVideos(): Promise<boolean | null>{
    let result = null
    const videosCollection = await database.collection('videos').find({}).toArray()
    if(videosCollection.length > 0) {
      result = await database.collection('videos').drop()
    }
    return result
  },

  async deletePosts(): Promise<boolean | null>{
    let result = null
    const postsCollection = await database.collection('posts').find({}).toArray()
    if(postsCollection.length > 0) {
      result = await database.collection('posts').drop()
    }
    return result
  },

  async deleteBlogs(): Promise<boolean | null>{
    let result = null
    const bloggersCollection = await database.collection('bloggers').find({}).toArray()
    if(bloggersCollection.length > 0) {
      result = await database.collection('bloggers').drop()
    }
    return result
  },
  
  async deleteUsers(): Promise<boolean | null> {
    let result = null
    const usersCollection = await database.collection('users').find({}).toArray()
    if(usersCollection.length > 0) {
      result = await database.collection('users').drop()
    }
    return result
  },

  async deleteCourses(): Promise<boolean | null | undefined >{
    let result
    const coursesCollection = await database.collection('courses').find({}).toArray()
    if(coursesCollection.length > 0) {
      result = await database.collection('courses').drop()
      return result
    } else {
      return null
    }
    return result
  },

  async deleteComments(): Promise<boolean | null>{
    let result: boolean | null = null
    const comments = await database.collection('comments').find({}).toArray()
    if(comments.length > 0) {
      result = await database.collection('comments').drop()
    }
    return result
  }
}