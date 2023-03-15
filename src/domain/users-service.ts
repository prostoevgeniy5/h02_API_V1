import { UserDBType, UserInputModel, UserViewModel } from "../repositories/db"
import { usersRepository } from "../repositories/users-repository"
import bcrypt from 'bcrypt'
import { getPostsOrBlogsOrUsers } from "../repositories/query-repository"


export const usersService = {
  async createUser(login: string, email:string, password: string): Promise<UserViewModel | undefined>{
    // 1 create salt for password
    const passwordSalt = await bcrypt.genSalt(10)
    // 2 create hash with ising salt
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser: UserDBType = {
      id: (new Date()).toString(),
      login: login,
      email: email,
      passwordSalt,
      passwordHash,
      createdAt: (new Date()).toISOString()
    }

    let result = usersRepository.createUser(newUser)
    if(result !== undefined) {
      return newUser
    } else {
      return undefined
    }
    
  },

  async checkCredentials(loginOrEmail: string, password: string): Promise<boolean>{
    const result = await getPostsOrBlogsOrUsers.getUserByLoginOrEmail(loginOrEmail)
    if(result === undefined ) {
      return false
    }
    const hash = await this._generateHash(password, result[0].passwordSalt)
    if(hash !== result[0].passwordHash) {
      return false
    } 
      return true
  },

  async _generateHash(pass: string, salt: string) {
    const hash = await bcrypt.hash(pass, salt)
    console.log(`pass - ${pass} salt - ${salt} hash - ${hash}`)
    return hash
  },

  async deleteUser(userId: string): Promise<number | null> {
    const result = await usersRepository.deleteUser(userId)
    return result
  }
}