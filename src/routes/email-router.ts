// import { Request, Response, Router } from 'express'
// import { emailAdapter } from '../adapters/email-adapter'

// export const emailRouter = Router({})

// emailRouter.post('/', async (req: Request, res: Response) => {
//   const result = await emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.message)
//   // const transport = nodemailer.createTransport({
//   //   service: 'gmail',
//   //   auth: {
//   //     user: settings.GMAIL,
//   //     pass: settings.GMAIL_PASSWORD
//   //   }

//   // })

//   // let info = await transport.sendMail({
//   //   from: "Evgeni",
//   //   to: req.body.email,
//   //   subject: req.body.subject,
//   //   // text: 'text message',
//   //   html: req.body.message
//   // })
//   if(!result){
//     res.sendStatus(400)
//   }
//   console.log('info', result)
//   res.sendStatus(204)
// })