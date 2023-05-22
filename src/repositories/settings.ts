export const settings = {
  JWT_SECRET: process.env.JWT_SECRET || '123456',
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET || '1234567',
  GMAIL: process.env.GMAIL,
  GMAIL_PASSWORD: process.env.GMAIL_PASS,
  EMAIL: process.env.EMAIL,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}