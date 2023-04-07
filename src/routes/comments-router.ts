import { Request, Response, Router } from "express";
import { authObjectWithAuthMiddleware } from "../midlewares/authorization-midleware";
import { getPostsOrBlogsOrUsers } from "../repositories/query-repository";
import { CommentViewModel } from "../repositories/types";
import { commentsValidation } from "../midlewares/commentsValidation";
import { inputValidationMiddleware } from "../midlewares/inputValidationMiddleware";
import { serviceComments } from "../domain/comments-service";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
  const comment: CommentViewModel | undefined = await getPostsOrBlogsOrUsers.getCommentById(req.params.id)
  if(comment !== undefined) {
    return res.status(200).send(comment)
  } else {
    return res.sendStatus(404)
  }
})

commentsRouter.put('/:id',
  authObjectWithAuthMiddleware.authMidleware,
  commentsValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    let result: boolean | undefined = await serviceComments.updateComment(req)
    if(result) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(404)
    }
  }
)

commentsRouter.delete('/:id',
  authObjectWithAuthMiddleware.authMidleware,

  async (req: Request, res: Response) => {
    const result: boolean | undefined = await serviceComments.deleteComment(req) 
    if(result) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(404)
    }
  }
)