import { Request } from 'express'
import { CommentViewModelMyDBType, UserViewModel } from './types'
import { client } from './db'

const commentsCollection = client.db('blogspostsvideos').collection<CommentViewModelMyDBType>('comments')

export const commentsRepository = {
  async updateComment(req: Request): Promise<boolean | undefined> {
    const result = await commentsCollection.updateOne({id: req.params.id}, {$set: {content: req.body.content}})
    if(result.modifiedCount) {
      return true
    } else {
      return undefined
    }
  },

  async deleteComment(req: Request): Promise<boolean | undefined> {
    const result = await commentsCollection.deleteOne({id: req.params.id})
    if(result.deletedCount) {
      return true
    } else {
      return undefined
    }
    return 
  }
}