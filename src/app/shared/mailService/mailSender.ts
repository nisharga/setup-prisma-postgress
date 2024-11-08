import nodemailer from 'nodemailer' 
import config from '../../../config'

const EmailSender = async (
  email: string,
  subject: string,
  htmlContent: string,
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.app_host,
      port: Number(config.app_port),
      secure: true,
      auth: {
        user: config.app_email,
        pass: config.app_pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
    await transporter.verify()
    const mailOptions = {
      from: config.email_from,
      to: email,
      subject: subject,
      html: htmlContent,
    }
    const info = await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
export default EmailSender
