import { commentsRepository } from "../repositories/comments-repository";
import { postsRepository } from "../repositories/posts-repository";
import { CommentViewModel, CommentatorInfoType,CommentViewModelMyDBType, UserViewModel } from "../repositories/types";
import { getPostsOrBlogsOrUsers } from '../repositories/query-repository'
import { Request } from 'express'

export const serviceComments = {
  async createComment(user: UserViewModel, req: Request): Promise<CommentViewModel | null | undefined>{
    const post = await getPostsOrBlogsOrUsers.getPostsById(req.params.id)
    if(post === null) {
      return null
    }
    const comment = {
      id: (+(new Date())).toString(),
      content: req.body.content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login
      },
      createdAt: (new Date()).toISOString()
    }
    const result = postsRepository.createComment(comment, req.params.id)
    if(result !== null) {
      return comment
    } else {
      return undefined
    }      

  },

  async updateComment(req: Request, userId: string): Promise<boolean | undefined>{
    const result = await commentsRepository.updateComment(req, userId)
    if(result ) {
      return true
    } else if(result === false) {
      return false
    } else {
      return undefined
    }
  },

  async deleteComment(req: Request, userId: string): Promise<boolean | undefined>{
    const result = await commentsRepository.deleteComment(req, userId)
    if(result) {
      return true
    } else if(result === false) {
      return false
    } else {
      return undefined
    }
  }
}