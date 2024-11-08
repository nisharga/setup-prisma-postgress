import EmailSender from "./mailSender"
import { mailTemplates } from "./mailTemplates"

class MailService {
  async sendEmail(
    type: 'resetPassword' | 'verifyEmail',
    recipient: string,
    name: string,
    link: string,
  ): Promise<void> {
    let subject: string
    let htmlContent: string
    switch (type) {
      case 'resetPassword':
        subject = 'DiasporeX - Reset Password'
        htmlContent = mailTemplates.resetPasswordTemplate(name, link)
        break
      case 'verifyEmail':
        subject = 'DiasporeX - Email Verification'
        htmlContent = mailTemplates.emailVerificationTemplate(name, link)
        break
      default:
        throw new Error('Invalid email type provided')
    }
    await EmailSender(recipient, subject, htmlContent)
  } 
}

export const mailService = new MailService()