import { client } from './db'
import { CommentViewModelMyDBType, LoginModelType, TokensDBItemType, UserDBType, UserViewModel } from './types'

// type TokensItemType = {
//   usedToken: string
//   expiresTime: string
//   userId: string
// }
const tokensList = client.db('blogspostsvideos').collection<TokensDBItemType>('tokensBlist')

export const tokensRepository = {
  async addTokenToBlackList(token: string, expireTime: number, userId: string): Promise<TokensDBItemType | null>{
    const insertingObj = {usedToken: token, expiresTime: expireTime, userId: userId}
    const result = await tokensList.insertOne(insertingObj)
    if(result.insertedId) {
      return insertingObj
    }
    return null
  },
  //////////////////////////////////////////
  async deleteTokenFromBlackList(token: string): Promise<boolean | null>{
    const result = await tokensList.deleteOne({usedToken: token})
    if(result.deletedCount > 0) {
      return true
    }
    return null
  },
  ///////////////////////////////////////////////
  async getTokenFromBlackList(token: string): Promise<TokensDBItemType | null>{
    const result = await tokensList.findOne({usedToken: token})
    if(result) {
      return result
    }
    return null
  },
///////////////////////////////////////////////////
  async updateRefreshToken(token: string, expireTime: number, userId: string): Promise<boolean | null> {
    const result  = await tokensList.updateOne({userId: userId}, {$set:{usedToken: token, expiresTime: expireTime}})
    if(result.modifiedCount === 1) {
      return true
    } else {
      return false
    }
    return null
  }
}