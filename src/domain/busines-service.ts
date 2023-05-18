import { SentMessageInfo } from 'nodemailer'
import { emailAdapter } from '../adapters/email-adapter'
import { UserDBType } from '../repositories/types'
// import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const businesService = {
  async sendEmailConfirmation(user: UserDBType): Promise<SentMessageInfo | boolean | undefined>{
    let result:SentMessageInfo
    try {
      result = await emailAdapter.sendEmail(user)
    } catch(error) {
      console.error(error)
      return false
    }
      console.log('7 buisnes-servise result', result)
      return result
  }
}