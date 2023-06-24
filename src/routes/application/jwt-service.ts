import { Request, Response } from "express";
import { UserDBType, ResultTokenType, TokensType, UserIdWithTokensType, UserViewModel, TokensDBItemType } from "../../repositories/types";
import jwt, { JwtPayload }  from 'jsonwebtoken'
import { settings } from "../../repositories/settings";
import { getPostsOrBlogsOrUsers } from "../../repositories/query-repository";
import { tokensServiceObject } from "../../domain/tokens-service";
import { tokensRepository } from "../../repositories/tokenslist-repository";
// import { create } from "domain";

// type UserIdWithTokensType = {
//   userId: string
//   token: string
//   refreshToken: string
// }

export const jwtService = {
  async createJWT(obj: UserDBType, refreshTokenNow: string, createAccessToken: boolean = false): Promise<ResultTokenType | undefined> {
    console.log('16 jwt-service.ts ', settings.JWT_SECRET);
    if(createAccessToken) {
      // const token = jwt.sign({userId: obj.accountData.id}, settings.JWT_SECRET, {expiresIn: '15m'} )
      const token = jwt.sign({userId: obj.accountData.id}, settings.JWT_SECRET, {expiresIn: 10} )
      // 
      const refreshToken = jwt.sign({userId: obj.accountData.id}, settings.REFRESH_JWT_SECRET, {expiresIn: 20} )
      return { resultCode: 0,
              accessToken: token,
              refreshToken: refreshToken
      }
    } else if(!createAccessToken) {
      // const token = jwt.sign({userId: obj.accountData.id}, settings.JWT_SECRET, {expiresIn: '15m'} )
      const token = jwt.sign({userId: obj.accountData.id}, settings.JWT_SECRET, {expiresIn: 10} )
      // const refreshToken = jwt.sign({userId: obj.accountData.id}, settings.REFRESH_JWT_SECRET, {expiresIn: '24h'} )
      return { resultCode: 0,
              accessToken: token,
              refreshToken: refreshTokenNow
      }
    }
  },
/////////////////////////////////////////////
  async createNewRefreshToken(refreshToken: string): Promise<string | null | undefined> {
    try{
      const oldRefToken = await tokensRepository.getTokenFromBlackList(refreshToken)
      if(oldRefToken !== null && oldRefToken.expiresTime < (Date.now() / 1000)) {
        console.log('42 jwt-service.js oldRefToken.expiresTime (Date.now() / 1000)', oldRefToken.expiresTime,' ----- ', (Date.now() / 1000))
        const newRefreshToken = jwt.sign({userId: oldRefToken.userId}, settings.REFRESH_JWT_SECRET, {expiresIn: 20} )
        const res = await tokensRepository.addTokenToBlackList(newRefreshToken, 20, oldRefToken.userId)
        return newRefreshToken
      } 
    } catch(error) {
      return null
    }
    return undefined
  },
  ///////////////////////////////////////////////////////
  async getUserIdByToken(tokens: TokensType): Promise<UserIdWithTokensType | null | undefined>{
    try{
      let userObj: UserDBType | undefined
      const result: any = jwt.verify(tokens.token, settings.JWT_SECRET)
      const refreshResult: any = jwt.verify(tokens.refreshToken, settings.REFRESH_JWT_SECRET) 
      console.log('39 jwt-service result', result);     
       console.log('40 jwt-service result.expiresIn', result.expiresIn, Date.now()); 
      userObj = await getPostsOrBlogsOrUsers.findUserAllDataById(refreshResult.userId) 
      // если время протухания аксесс токена больше актуального времени
      if(result.expiresIn > Math.floor(Date.now() / 1000)) {
        console.log('43 result.expiretionIn', result.expiretionIn, '----', Math.floor(Date.now() / 1000))
        // если время протухания рефрештокена , больше актуального времени
        if(refreshResult.expiresIn > (Math.floor(Date.now() / 1000))) {
          
          if(userObj !== undefined) {
            return {
              userId: userObj.accountData.id,
              token:tokens.token,
              refreshToken: tokens.refreshToken
            }
          } else if(userObj === undefined) {
            return undefined
          }
        // если время протухания рефрештокена меньше актуального времени
        } else if(refreshResult.expiresIn < (Math.floor(Date.now() / 1000)) && userObj !== undefined) {
          const newRefreshToken: ResultTokenType | undefined  = await this.createJWT(userObj, tokens.refreshToken, false)
          if(newRefreshToken !== undefined) {
            const result = await tokensServiceObject.addTokenToBlackList(tokens.token, newRefreshToken.refreshToken)
            return {
              userId: userObj.accountData.id,
              token: newRefreshToken.accessToken,
              refreshToken: newRefreshToken.refreshToken
            }
          }
          
        }
        // если время протухания аксесстокена больше актуального и рефрештокен актуален
      } else if(result.expiresIn > Math.floor(Date.now() / 1000) && userObj !== undefined && refreshResult.expiresIn < (Math.floor(Date.now() / 1000))) {
        const newAccessToken = await this.createJWT(userObj, tokens.refreshToken, true)
        if(newAccessToken !== undefined) {
          return {
            userId: userObj.accountData.id,
            token: newAccessToken.accessToken,
            refreshToken: tokens.refreshToken
          }
        }
        // если время протухания аксесстокена больше актуального и рефрештокен не актуален          
      } else if(result.expiresIn > Math.floor(Date.now() / 1000) && userObj !== undefined && refreshResult.expiresIn > Math.floor(Date.now() / 1000)) {
        const newAccessToken = await this.createJWT(userObj, tokens.refreshToken, false)
        if(newAccessToken !== undefined) {
          return {
            userId: userObj.accountData.id,
            token: newAccessToken.accessToken,
            refreshToken: newAccessToken.refreshToken
          }
        }        
      }
      return undefined
    } catch(error) {
      return null
    }    
  },
///////////////////////////////////////////////
  async checkRefreshTokenAndUpdateBListTokens(refreshToken: string): Promise<boolean | null>{
    try{
    const refTokenVerified: any = jwt.verify(refreshToken, settings.REFRESH_JWT_SECRET)
    const refTokensItem: TokensDBItemType | null = await tokensRepository.getTokenFromBlackList(refreshToken)
    // let newToken: string = jwt.sign({userId: refTokenVerified.userId}, settings.REFRESH_JWT_SECRET, {expiresIn: 20} )
    // let RefreshToken: TokensItemType | null
    if(refTokenVerified.expiresIn < (Date.now() / 1000) && refTokensItem !== null)     {
      let newToken: string = jwt.sign({userId: refTokenVerified.userId}, settings.REFRESH_JWT_SECRET, {expiresIn: 20} )
      const result = await tokensRepository.updateRefreshToken(refTokenVerified, refTokenVerified.expiresIn, refTokensItem.userId)
      if(result !== null) {
        return true      
      }
    }
    } catch(error) {
      return false
    }
    return null    
  }
    // try{
    //   let userObj: UserDBType | undefined
    //   //const result: any = jwt.verify(tokens.token, settings.JWT_SECRET)
    //   const refreshResult: any = jwt.verify(refreshToken, settings.REFRESH_JWT_SECRET) 
          
    //    console.log('107 jwt-service rerfreshResult.expiresIn', refreshResult.expiresIn, Date.now()); 
    //   userObj = await getPostsOrBlogsOrUsers.findUserAllDataById(refreshResult.userId) 
    //   // если время протухания аксесс токена больше актуального времени
    //   if(refreshResult.expiresIn > Math.floor(Date.now() / 1000)) {
    //     console.log('43 result.expiretionIn', result.expiretionIn, '----', Math.floor(Date.now() / 1000))
    //     // если время протухания рефрештокена , больше актуального времени
    //     if(refreshResult.expiresIn > (Math.floor(Date.now() / 1000))) {
          
    //       if(userObj !== undefined) {
    //         return {
    //           userId: userObj.accountData.id,
    //           token:tokens.token,
    //           refreshToken: tokens.refreshToken
    //         }
    //       } else if(userObj === undefined) {
    //         return undefined
    //       }
    //     // если время протухания рефрештокена меньше актуального времени
    //     } else if(refreshResult.expiresIn < (Math.floor(Date.now() / 1000)) && userObj !== undefined) {
    //       const newRefreshToken: ResultTokenType | undefined  = await this.createJWT(userObj, tokens.refreshToken, false)
    //       if(newRefreshToken !== undefined) {
    //         const result = await tokensServiceObject.addTokenToBlackList(tokens.token, newRefreshToken.refreshToken)
    //         return {
    //           userId: userObj.accountData.id,
    //           token: newRefreshToken.accessToken,
    //           refreshToken: newRefreshToken.refreshToken
    //         }
    //       }
          
    //     }
    //     // если время протухания аксесстокена больше актуального и рефрештокен актуален
    //   } else if(result.expiresIn > Math.floor(Date.now() / 1000) && userObj !== undefined && refreshResult.expiresIn < (Math.floor(Date.now() / 1000))) {
    //     const newAccessToken = await this.createJWT(userObj, tokens.refreshToken, true)
    //     if(newAccessToken !== undefined) {
    //       return {
    //         userId: userObj.accountData.id,
    //         token: newAccessToken.accessToken,
    //         refreshToken: tokens.refreshToken
    //       }
    //     }
    //     // если время протухания аксесстокена больше актуального и рефрештокен не актуален          
    //   } else if(result.expiresIn > Math.floor(Date.now() / 1000) && userObj !== undefined && refreshResult.expiresIn > Math.floor(Date.now() / 1000)) {
    //     const newAccessToken = await this.createJWT(userObj, tokens.refreshToken, false)
    //     if(newAccessToken !== undefined) {
    //       return {
    //         userId: userObj.accountData.id,
    //         token: newAccessToken.accessToken,
    //         refreshToken: newAccessToken.refreshToken
    //       }
    //     }        
    //   }
    //   return undefined


}

// Вот пример того, как приложение может использовать токены обновления JWT 
// в приложении Node.js:

// 1. Пользователь входит в приложение и отправляет свои учетные данные на 
//    сервер аутентификации.

// 2. Сервер аутентификации проверяет учетные данные, создает маркер доступа 
//    JWT и маркер обновления JWT. Маркер доступа содержит утверждения 
//    пользователя (например, идентификатор пользователя, роль и т. д.), а 
//    маркер обновления содержит утверждение, указывающее время истечения 
//    срока действия маркера доступа.
// 3. Сервер аутентификации отправляет токен доступа и токен обновления клиенту.

// 4. Клиент хранит токены в локальном хранилище или в виде безопасного 
//    файла cookie только для HTTP.

// 5. Клиент отправляет токен доступа с каждым запросом на доступ к защищенным 
//    ресурсам.

// 6. Когда срок действия токена доступа истекает, клиент отправляет токен 
//    обновления на сервер аутентификации, чтобы получить новый токен доступа.

// 7. Сервер аутентификации проверяет токен обновления и проверяет утверждение 
//    срока действия. Если токен обновления действителен и срок его действия 
//    не истек, сервер аутентификации выдает новый токен доступа с новым 
//    сроком действия.

// 8. Сервер аутентификации отправляет новый токен доступа клиенту.

// 9. Клиент сохраняет новый токен доступа и продолжает использовать его для 
//    доступа к защищенным ресурсам.

// В этом примере JWT используется в качестве автономных токенов обновления, 
// которые можно хранить на стороне клиента и использовать для проверки 
// подлинности и авторизации пользователей в нескольких доменах.