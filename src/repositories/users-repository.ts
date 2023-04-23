import { client } from './db'
import { LoginModelType, UserDBType, UserViewModel } from './types'

const databaseUsersCollecrtion = client.db('blogspostsvideos').collection<UserDBType>('users')

export const usersRepository = {
  async createUser(user: UserDBType): Promise<UserViewModel | undefined> {

    const result = await databaseUsersCollecrtion.insertOne(user)
    if(result.insertedId) {
      const resultObj: UserViewModel = Object.assign({}, user.accountData)
      // {  
      //   id: '',
      //   login: '',
      //   email: '',
      //   createdAt: ''
      // }
      // Object.keys(user.accountData).forEach((elem: string) => {
      //   if (elem === 'id' || elem === 'login' || elem === 'email' || elem === 'createdAt') {
      //     resultObj[elem] = user[elem]
      //   }
      // })
     
      return resultObj 
    } else {
      return undefined
    }
  },

  // async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType[] | undefined>  {
  //   const result = await databaseUsersCollecrtion.find({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}).toArray()
  //   if(result.length) {
  //     return result
  //   } else {
  //     return undefined
  //   }
  // },

  async deleteUser(userId: string): Promise<number | null> {
    const result = await databaseUsersCollecrtion.deleteOne({ id: userId })
    if(result.deletedCount === 1) {
      return result.deletedCount
    } else {
      return null
    }
  }
}