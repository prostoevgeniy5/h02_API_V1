import { Request, Response, NextFunction } from "express";

export const authMidleware =  (req: Request, res: Response, next: NextFunction) => {
    if(req.method === "GET") {
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
     console.log(req.headers.authorization.split(' ')[0])
    console.log(req.headers.authorization.split(' ')[1], "===", loginPasswordEncoded)
    console.log(atob(req.headers.authorization.split(' ')[1]))
     if(req.headers.authorization.split(' ')[0] === 'Basic' && req.headers.authorization.split(' ')[1] === loginPasswordEncoded) {
        next()
        return
     } else {
      res.status(401).send("Your did'nt pass authorisation")
      return
     }
   }
 }