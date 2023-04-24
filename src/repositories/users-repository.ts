import add from 'date-fns/add'
import { client } from './db'
import { LoginModelType, UserDBType, UserViewModel } from './types'

const databaseUsersCollection = client.db('blogspostsvideos').collection<UserDBType>('users')

export const usersRepository = {
  async createUser(user: UserDBType): Promise<UserViewModel | undefined> {

    const result = await databaseUsersCollection.insertOne(user)
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
    const result = await databaseUsersCollection.deleteOne({ id: userId })
    if(result.deletedCount === 1) {
      return result.deletedCount
    } else {
      return null
    }
  },
//////////////////////////////////////////////
  async updateUserByConfirmationCode(user: UserDBType): Promise<boolean | null>{
    const result = await databaseUsersCollection.updateOne({"emailConfirmation.confirmationCode": user.emailConfirmation.confirmationCode}, {$set: {"emailConfirmation.isConfirmed": true, "emailConfirmation.expirationDate": add(new Date(), {
      hours: 0,
      minutes: user.emailConfirmation.expirationDate.getMinutes() - 1
    })}})
    console.log("54 user-repository.ts result", result)
    if(result.modifiedCount) {
      return true
    } else {
    console.log('58 users-repository.ts before deleted result.upsertedId', result.upsertedId)
      // await databaseUsersCollection.deleteOne({_id: result.upsertedId})
      return null
    }
  } 
}