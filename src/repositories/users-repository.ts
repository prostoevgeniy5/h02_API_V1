import add from 'date-fns/add'
import { client } from './db'
import { CommentViewModelMyDBType, LoginModelType, UserDBType, UserViewModel } from './types'

const databaseUsersCollection = client.db('blogspostsvideos').collection<UserDBType>('users')
const commentsCollection = client.db('blogspostsvideos').collection<CommentViewModelMyDBType>('comments')

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
    const deletedComment = await commentsCollection.deleteMany({"commentatorInfo.userId": userId})
    if(result.deletedCount === 1) {
      return result.deletedCount
    } else {
      return null
    }
  },
//////////////////////////////////////////////
  async updateUserByConfirmationCode(code: string): Promise<boolean | null>{
    const expireData = add(new Date(), {
      hours: 10,
      minutes: 10
    }) 
    console.log('Date.now',new Date(Date.now()))
    console.log('56 user-repository.ts expireData', expireData)
    const result = await databaseUsersCollection.updateOne({"emailConfirmation.confirmationCode" : code}, {$set: {"emailConfirmation.isConfirmed": true, "emailConfirmation.expirationDate": expireData}})
    console.log("58 user-repository.ts result.upsertedCount", result)
    if(result.modifiedCount) {
      return true
    } else {
    console.log('62 users-repository.ts before deleted result.upsertedId', result.upsertedId)
      // await databaseUsersCollection.deleteOne({_id: result.upsertedId})
      return null
    }
  },
  
  async confirmEmailCode(code: string){
    return databaseUsersCollection.updateOne({"emailConfirmation.confirmationCode" : code}, {$set: {"emailConfirmation.isConfirmed": true, "emailConfirmation.expirationDate": null, "emailConfirmation.confirmationCode" : null}})
  }
}