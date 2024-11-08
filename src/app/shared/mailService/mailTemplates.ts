class MailTemplates {
    private buttonStyle = `
      background-color: #9747FF;
      color: white;
      border: none;
      padding: 12px 20px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `
  
    private emailContainer(content: string): string {
      return `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);">
              ${content}
            </div>
          </body>
        </html>
      `
    }
  
    private emailFooter(): string {
      return `
        <hr />
        <p style="font-size: 14px; color: #888; text-align: center;">
          For any questions, contact our support team at <a href="mailto:support@diasporex.com" style="color: #9747FF;">support@diasporex.com</a>.
        </p>
        <p style="font-size: 14px; text-align: center; color: #6c757d;">
          Best regards,<br />
          The DiasporeX Team
        </p>
      `
    }
  
    private button(text: string, link: string): string {
      return `
        <p>
          <a href="${link}" style="text-decoration: none;">
            <button style="${this.buttonStyle}">
              ${text}
            </button>
          </a>
        </p>
      `
    }
  
    resetPasswordTemplate(name: string, resetPassLink: string): string {
      const content = `
        <p style="font-size: 16px;">Hello, ${name},</p>
        <p style="font-size: 16px;">We received a request to reset your password for your DiasporeX account. If you did not request this change, please disregard this email. If you did, you can reset your password by clicking the button below:</p>
        ${this.button('Reset Password', resetPassLink)}
        <p style="font-size: 16px;">If you did not request a password reset, please ignore this email or contact our support team.</p>
        ${this.emailFooter()}
      `
      return this.emailContainer(content)
    }
  
    emailVerificationTemplate(
      name: string,
      emailVerificationLink: string,
    ): string {
      const content = `
        <p style="font-size: 16px;">Hello ${name},</p>
        <p style="font-size: 16px;">Thank you for signing up with DiasporeX. To complete your registration, please verify your email address by clicking the button below.</p>
        ${this.button('Verify Email Address', emailVerificationLink)}
        <p style="font-size: 16px;">If you didn’t sign up for DiasporeX, please ignore this email. If you need assistance, feel free to contact us.</p>
        ${this.emailFooter()}
      `
      return this.emailContainer(content)
    }
  }
export const mailTemplates = new MailTemplates()