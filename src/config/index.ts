/* eslint-disable no-undef */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXP_DATE,
  secret_access_token: process.env.SECRET_ACCESS_TOKEN,
  refresh_token_exp: process.env.REFRESH_TOKEN_EXP,
  refresh_token: process.env.REFRESH_TOKEN,
  reset_pass_token: process.env.RESET_PASS_TOKEN,
  reset_pass_link: process.env.RESET_PASSWORD_LINK,
  reset_pass_exp: process.env.RESET_PASS_EXP,
  email_verify_token: process.env.VERIFY_EMAIL_TOKEN,
  email_verify_exp: process.env.VERIFY_EMAIL_EXP,
  node_env: process.env.NODE_ENV,
  verify_link: {
    user_verify_link: process.env.USER_FRONTEND_URL,
    agent_verify_link: process.env.AGENT_FRONTEND_URL,
    admin_verify_link: process.env.ADMIN_FRONTEND_URL,
    user_production_url: process.env.USER_FRONTEND_PRODUCTION_URL,
    agent_production_url: process.env.AGENT_FRONTEND_PRODUCTION_URL,
    admin_production_url: process.env.ADMIN_FRONTEND_PRODUCTION_URL,
  },

  // all mail-services
  app_host: process.env.APP_HOST,
  app_port: process.env.APP_PORT,
  app_email: process.env.APP_EMAIL,
  app_pass: process.env.APP_PASS, 
  email_from: process.env.EMAIL_FROM,
  app_user: process.env.APP_NAME,

  // cloudinary 
  cloud_env: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  }

  
}