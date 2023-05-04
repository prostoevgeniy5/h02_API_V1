import { DeleteResult } from 'mongodb'
import {client} from './db'

const database = client.db('blogspostsvideos')

export const deleteAllCollections = {
  async deleteVideos(): Promise<boolean | null>{
    let result: DeleteResult | null | undefined  = null
    const videosCollection = await database.collection('videos').find({}).toArray()
    if(videosCollection.length > 0) {
      // result = await database.collection('videos').drop()
      result = await database.collection('videos').deleteMany({})
    } 
    if(result !== undefined && result !== null && result.deletedCount > 0) {
      return true
    } else {
      return null
    }
    
  },

  async deletePosts(): Promise<boolean | null>{
    let result: DeleteResult | null = null
    const postsCollection = await database.collection('posts').find({}).toArray()
    if(postsCollection.length > 0) {
      result = await database.collection('posts').deleteMany({})
    }
    if(result !== undefined && result !== null && result.deletedCount > 0) {
      return true
    } else {
      return null
    }
  },

  async deleteBlogs(): Promise<boolean | null>{
    let result = null
    const bloggersCollection = await database.collection('bloggers').find({}).toArray()
    if(bloggersCollection.length > 0) {
      result = await database.collection('bloggers').deleteMany({})
    }
    if(result !== undefined && result !== null && result.deletedCount > 0) {
      return true
    } else {
      return null
    }
  },
  
  async deleteUsers(): Promise<boolean | null> {
    let result = null
    const usersCollection = await database.collection('users').find({}).toArray()
    if(usersCollection.length > 0) {
      result = await database.collection('users').deleteMany({})
    }
    if(result !== undefined && result !== null && result.deletedCount > 0) {
      return true
    } else {
      return null
    }
  },

  async deleteCourses(): Promise<boolean | null | undefined >{
    let result: DeleteResult | null = null
    const coursesCollection = await database.collection('courses').find({}).toArray()
    if(coursesCollection.length > 0) {
      result = await database.collection('courses').deleteMany({})
      
    } 
    if(result !== undefined && result !== null && result.deletedCount > 0) {
      return true
    } else {
      return null
    }
  },

  async deleteComments(): Promise<boolean | null>{
    let result: DeleteResult | null = null
    const comments = await database.collection('comments').find({}).toArray()
    if(comments.length > 0) {
      result = await database.collection('comments').deleteMany({})
    }
    if(result !== undefined && result !== null && result.deletedCount > 0) {
      return true
    } else {
      return null
    }
  }
}