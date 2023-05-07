import { Request, Response, NextFunction } from "express";
import { getPostsOrBlogsOrUsers } from "../repositories/query-repository";
import { jwtService } from "../routes/application/jwt-service";
import { CommentViewModel } from "../repositories/types";
import { createAwait } from "typescript";
import { usersService } from "../domain/authusers-service";

export const authMidleware  = async (req: Request, res: Response, next: NextFunction) => {
  
    if(req.method === "GET" || (req.method === "POST"  && (req.path === '/login'))) {
        next()
        return
    }
    if(!req.headers.authorization) {
     res.status(401).send("Your are not authorized")
     return
    }
   if((req.method === "POST" || req.method === "PUT" || req.method === "DELETE") && req.headers.authorization) {
    //  let parole = "Basic YWRtaW46cXdlcnR5"
     let loginPasswordEncoded = btoa("admin:qwerty")
    //  let comment: CommentViewModel | undefined
    //  if(req.originalUrl.split('/')[1] === 'comments') {
    //   comment = await getPostsOrBlogsOrUsers.getCommentById(req.params.id)
    //   if(comment) {
    //     console.log('25authorization-midleware.ts get password',req.headers.authorization.split(' ')[1], "===")
    //     const result = await usersService.checkCredentials(comment.commentatorInfo.userLogin, req.headers.authorization.split(' ')[1])
    //   }
      
    // }     
    console.log('30 authorization-midleware.ts',req.headers)
    console.log(req.headers.authorization.split(' ')[0])
    console.log(req.headers.authorization.split(' ')[1], "===", loginPasswordEncoded)
    console.log('33 authorization-midleware.ts', atob(req.headers.authorization.split(' ')[1]))
     if(req.headers.authorization.split(' ')[0] === 'Basic' && req.headers.authorization.split(' ')[1] === loginPasswordEncoded) {
       
      next()
        return
     } else {
      res.status(401).send("Your did'nt pass authorisation")
      return
     }
   }
 }
/////////////////////////////////////////////////////////
 export const authObjectWithAuthMiddleware = {
  user: {
    id: '',
    login: '',
    email: ''
  },
  authMidleware : async (req: Request, res: Response, next: NextFunction) => {
  console.log('52 authorization.ts req.headers.authorization', req.headers.authorization)
  console.log('53 authorization.ts req.originalUrl', req.originalUrl.split('/')[1])
  let comment: CommentViewModel | undefined
  if(!req.headers.authorization) {
    res.sendStatus(401)
    return
  }
  if(req.originalUrl.split('/')[1] === 'comments') {
    comment = await getPostsOrBlogsOrUsers.getCommentById(req.params.id)
  }

  const token = req.headers.authorization.split(' ')[1]
  const userId = await jwtService.getUserIdByToken(token)
  
  if(userId) {
    if(comment !== undefined && userId !== comment.commentatorInfo.userId) {
      return res.status(403).send('User is not author of the comment')
    }
    const user = await getPostsOrBlogsOrUsers.findUserById(userId)
    if(user !== undefined) {
      authObjectWithAuthMiddleware.user = user
    next()
    return
    }
    
  } else {
    console.log('78 authorisation-middlevare.ts userId', userId)
    res.sendStatus(401)
    return
  }

 }
}