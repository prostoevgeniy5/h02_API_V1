import { SentMessageInfo } from 'nodemailer'
import { emailAdapter } from '../adapters/email-adapter'
import { UserDBType } from '../repositories/types'

export const businesService = {
  async sendEmailConfirmation(user: UserDBType): Promise<SentMessageInfo | boolean>{
    const result = await emailAdapter.sendEmail(user)
    if(result) {
      console.log('7 buisnes-servise result', result)
      return result
    } else {
      return false
    }
  }
}