import { UserDBType, UserInputModel, UserViewModel } from "../repositories/types"
import { usersRepository } from "../repositories/users-repository"
import bcrypt from 'bcrypt'
import { getPostsOrBlogsOrUsers } from "../repositories/query-repository"
import { businesService } from "./busines-service"
import { v4 as uuidv4 } from 'uuid'
import add from "date-fns/add"

export const usersService = {
  async createUser(login: string, email: string, password: string): Promise<UserViewModel | undefined | null> {
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
        return null
      }
    } else {
      return undefined
    }

  },

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
    }
    return result
  },

  async _generateHash(pass: string, salt: string) {
    const hash = await bcrypt.hash(pass, salt)
    return hash
  },

  async deleteUser(userId: string): Promise<number | null> {
    const result = await usersRepository.deleteUser(userId)
    return result
  }
}