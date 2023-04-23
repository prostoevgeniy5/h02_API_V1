import nodemailer from 'nodemailer'
import { settings } from '../repositories/settings'
import { UserDBType } from '../repositories/types'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const emailAdapter = {
  async sendEmail(user: UserDBType): Promise<SMTPTransport.SentMessageInfo | boolean> {
    const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: settings.GMAIL,
      pass: settings.GMAIL_PASSWORD
    }

  })

  let info = await transport.sendMail({
    from: user.accountData.login,
    to: user.accountData.email,
    subject: "registration",
    // text: 'text message',
    html: `<div><p>Confirmation code is ${user.emailConfirmation.confirmationCode}</p><div><a href=#>link registration confirmation</a></div></div>`
  })
  if(info && info.accepted.length > 0) {
    return info
  }
  // console.log('info', info)
  // res.status(201).send({info})
  return false

  }

}