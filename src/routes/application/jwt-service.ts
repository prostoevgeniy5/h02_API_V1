import { Request, Response } from "express";
import { UserDBType, ResultTokenType } from "../../repositories/types";
import jwt  from 'jsonwebtoken'
import { settings } from "../../repositories/settings";

// type ResultTokenType = {
//   resultCode: number
//   token: string
// }

export const jwtService = {
  async createJWT(obj: UserDBType): Promise<ResultTokenType> {
    console.log('13 jwt-service.ts ', settings.JWT_SECRET);
    
    const token = jwt.sign({userId: obj.id}, settings.JWT_SECRET, {expiresIn: '1h'} )
    return { resultCode: 0,
            token: token
    }
  },

  async getUserIdByToken(token: string): Promise<string | null>{
    try{
      const result: any = jwt.verify(token, settings.JWT_SECRET)
      console.log('24 jwt-service result.userId', result.userId);      
      return result.userId
    } catch(error) {
      return null
    }    
  }
}