import { client, LoginModelType, UserDBType, UserViewModel} from './db'

const databaseUsersCollecrtion = client.db('blogspostsvideos').collection<UserDBType>('users')

export const usersRepository = {
  async createUser(user: UserDBType): Promise<UserDBType | undefined> {

    const result = await databaseUsersCollecrtion.insertOne(user)
    if(result.insertedId) {
      return user
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