import { Request, Response } from "express";
import { UserDBType } from "../../repositories/db";
import jwt  from 'jsonwebtoken'

type ResultTokenType = {
  resultCode: number
  token: string
}

export const jwtService = {
  async createJWT(obj: UserDBType): Promise<ResultTokenType> {
    const token = await jwt.sign({userId: obj.id}, settings.JWT_SECRET, {expiresIn: '1h'} )
    return { resultCode: 0,
            token: token
    }
  },

  async getUserIdByToken(token: string): Promise<string | null>{
    try{
      const result: any = jwt.verify(token, settings.JWT_SECRET)
      return result.userId
    } catch(error) {
      return null
    }
    
  }
}