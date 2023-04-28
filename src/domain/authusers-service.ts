import { LoginOrEmailType, UserDBType, UserInputModel, UserViewModel } from "../repositories/types"
import { usersRepository } from "../repositories/users-repository"
import bcrypt from 'bcrypt'
import { getPostsOrBlogsOrUsers } from "../repositories/query-repository"
import { businesService } from "./busines-service"
import { v4 as uuidv4 } from 'uuid'
import add from "date-fns/add"

// type EmailType = {
//   field: string
// }

// type LoginType = {
//   data: string
// }

export const usersService = {
  async createUser(login: string, email: string, password: string): Promise<UserViewModel | string | undefined | null> {
    const pattern = /^[\w-\. ]+@([\w-]+\.)+[\w-]{2,4}$/
    // let logOrEmail: LoginOrEmailType = {'field': 'login'}
    const field = await getPostsOrBlogsOrUsers.checkExistingUser(login, email)
    
    if(field) {
      return field
      // if(pattern.test(field)) {
      //    // logOrEmail = {'field': 'email'}
      //   return 'email'
      // } else {
      //   return 'login'
      // }
    }
    // 1 create salt for password
    const passwordSalt = await bcrypt.genSalt(10)
    // 2 create hash with ising salt
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser: UserDBType = {
      accountData: {
        id: (+(new Date())).toString(),
        login: login,
        email: email,
        passwordSalt,
        passwordHash,
        createdAt: (new Date()).toISOString()
      },
      // uuidv4() create unique id
      // add Добавляет к текущей дате new Date() время здесь 1 час 7 минут
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 7
        }),
        isConfirmed: false
      },
    }
    let result = await usersRepository.createUser(newUser)
    if (result !== undefined) {
      const info = await businesService.sendEmailConfirmation(newUser)
      if (info) {
        return result
      } else {
        let res = await usersRepository.deleteUser(newUser.accountData.id)
        if(res) {
          return null
        }
        return undefined
      }
    } else {
      return undefined
    }
  },
///////////////////////////////////////////////////
  async checkCredentials(loginOrEmail: string, password: string): Promise<UserDBType | false> {
    const result = await getPostsOrBlogsOrUsers.getUserByLoginOrEmail(loginOrEmail)
    console.log('34 users-servise.ts result', result);
    if (!result) {
      return false
    }
    const hash = await this._generateHash(password, result.accountData.passwordSalt)
    // const compareResult = await bcrypt.compare(password, result.passwordHash)
    if (result.accountData.passwordHash !== hash) {
      return false
    } else if(!result.emailConfirmation.isConfirmed) {
      return false
    }
    return result
  },
///////////////////////////////////////////////////////
  async _generateHash(pass: string, salt: string) {
    const hash = await bcrypt.hash(pass, salt)
    return hash
  },
//////////////////////////////////////////////////////
  async deleteUser(userId: string): Promise<number | null> {
    // const userComments = await 
    let result = await usersRepository.deleteUser(userId)
    return result
  },
/////////////////////////////////////////////////////
  async confirmEmail(code: string): Promise<boolean | null | undefined>{
    let updatedResult: boolean | null | undefined
    const user = await getPostsOrBlogsOrUsers.getUserByConfirmationCode(code)
    if(user) {
      if(+Date.parse(user.emailConfirmation.expirationDate.toString()) < +Date.now()) {
        return null
      } else if(user.emailConfirmation.isConfirmed) {
        return true
      } else {
        updatedResult = await usersRepository.updateUserByConfirmationCode(code)
      } if( !updatedResult) {
        return null
      } else if(updatedResult) {
        return true
      }
    }
    // let updatedResult: boolean | null | undefined = await usersRepository.updateUserByConfirmationCode(code)
    // if(updatedResult) {
    //   return true
    // } else if(updatedResult === null) {
    //   return null
    // }
    return undefined
  },
///////////////////////////////////////////////////
  async confirmEmailResending(email: string): Promise<boolean | null> {
    const user: UserDBType | null | undefined = await getPostsOrBlogsOrUsers.getUserByLoginOrEmail(email)
      if (!user) {
        return null
      } else {
        const result = await this.confirmEmail(user.emailConfirmation.confirmationCode)
        if(result) {
          return true
        } else {
          return null
        }  
      }    
  }    
}