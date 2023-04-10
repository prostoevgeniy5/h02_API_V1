import { Request } from 'express'
import { CommentViewModelMyDBType, UserViewModel } from './types'
import { client } from './db'

const commentsCollection = client.db('blogspostsvideos').collection<CommentViewModelMyDBType>('comments')

export const commentsRepository = {

  async updateComment(req: Request, userId: string): Promise<boolean | undefined> {
    const comment = await commentsCollection.findOne({id: req.params .id})
    if( comment !== null && userId !== comment.commentatorInfo.userId) {
      return false
    }
    const result = await commentsCollection.updateOne({id: req.params.id}, {$set: {content: req.body.content}})
    // console.log('10 comments-repository.ts result.upsertedId', result.upsertedId)
    if(result.modifiedCount) {
      return true
    } else {
      return undefined
    }
  },

  async deleteComment(req: Request): Promise<boolean | null | undefined> {
    const result = await commentsCollection.deleteOne({id: req.params.id})
    if(result.deletedCount > 0) {
      return true
    } else {
      return null
    }
    return undefined
  }
}