import { commentsRepository } from "../repositories/comments-repository";
import { postsRepository } from "../repositories/posts-repository";
import { CommentViewModel, CommentatorInfoType,CommentViewModelMyDBType, UserViewModel } from "../repositories/types";
import { Request } from 'express'

export const serviceComments = {
  async createComment(user: UserViewModel, req: Request): Promise<CommentViewModel | undefined>{
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

  async updateComment(req: Request): Promise<boolean | undefined>{
    const result = await commentsRepository.updateComment(req)
    if(result) {
      return true
    } else {
      return undefined
    }
  },

  async deleteComment(req: Request): Promise<boolean | undefined>{
    const result = await commentsRepository.deleteComment(req)
    if(result) {
      return true
    } else {
      return undefined
    }
  }
}