import jwt  from 'jsonwebtoken'
import { settings } from "../repositories/settings";
import { TokensDBItemType } from '../repositories/types';
import { tokensRepository } from '../repositories/tokenslist-repository';

export const tokensServiceObject = {
  async addTokenToBlackList(accessToken: string, refToken: string): Promise<TokensDBItemType | string | null> {
    const resultVer: any = jwt.verify(refToken, settings.REFRESH_JWT_SECRET) 
    console.log('9 tokens-servicets expiresIn', resultVer.expiresIn)
    if(resultVer.userId) {
      if(resultVer.expiresIn < (Math.floor(Date.now() / 1000))) {
        const result = await tokensRepository.addTokenToBlackList(refToken, resultVer.expiresIn, resultVer.userId)
        if(result) {
          return result
        } else {
          return null
        }
      } else {
        return "notexpired"
      }
      
    }
    return null
  },
  ///////////////////////////////////////////
  
}