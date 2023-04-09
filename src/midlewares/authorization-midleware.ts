import { Request, Response, NextFunction } from "express";
import { getPostsOrBlogsOrUsers } from "../repositories/query-repository";
import { jwtService } from "../routes/application/jwt-service";

export const authMidleware  =  (req: Request, res: Response, next: NextFunction) => {
  
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
     // console.log(req.headers)
    // console.log(req.headers.authorization.split(' ')[0])
    // console.log(req.headers.authorization.split(' ')[1], "===", loginPasswordEncoded)
    // console.log(atob(req.headers.authorization.split(' ')[1]))
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
  if(!req.headers.authorization) {
    res.sendStatus(401)
    return
  }

  const token = req.headers.authorization.split(' ')[1]
  const userId = await jwtService.getUserIdByToken(token)
  if(userId) {
    const user = await getPostsOrBlogsOrUsers.findUserById(userId)
    if(user !== undefined) {
      authObjectWithAuthMiddleware.user = user
    next()
    return
    }
    
  } else {
    res.sendStatus(401)
    return
  }

 }
}