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
    from: "NodemailApp",
    to: user.accountData.email,
    subject: "registration",
    // text: 'text message',
    html: `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>

    </p>`
  })
  console.log('27 email-adapter.ts info ', info)
  if(info && info.accepted.length > 0) {
    return info
  }
  // console.log('info', info)
  // res.status(201).send({info})
  return false

  }

}