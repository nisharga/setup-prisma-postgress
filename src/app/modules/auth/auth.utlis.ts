import { Role } from "@prisma/client"
import config from "../../../config"
import { jwtHelpers } from "../../helpers"

export const generateAccessToken = (user: {
  id: string
  name: string
  email: string
  role: string
}) => {
  const encryptedData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
  return jwtHelpers.generateToken(
    encryptedData,
    config.secret_access_token as string,
    config.access_token_expires_in as string,
  )
}

export const generateRefreshToken = (user: {
  id: string
  name: string
  email: string
  role: string
}) => {
  const encryptedData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
  return jwtHelpers.generateToken(
    encryptedData,
    config.refresh_token as string,
    config.refresh_token_exp as string,
  )
}

export const generateTokens = (user: {
  id: string
  name: string
  email: string
  role: string
}) => {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

export const generateResetToken = (user: {
  id: string
  name: string
  email: string
  role: string
}) => {
  const encryptedData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
  return jwtHelpers.generateToken(
    encryptedData,
    config.reset_pass_token as string,
    config.reset_pass_exp as string,
  )
}

export const generateEmailVerifyToken = (user: {
  id: string
  name: string
  email: string
  role: string
}) => {
  const encryptedData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
  return jwtHelpers.generateToken(
    encryptedData,
    config.email_verify_token as string,
    config.email_verify_exp as string,
  )
}

export enum ActionType {
  emailVerify = 'email-verify',
  resetPassword = 'reset-password',
}

export const generateActionLink = (
  role: string,
  token: string,
  actionType: ActionType,
): string => {
  let frontendUrl: string
  switch (role) {
    case Role.USER:
      frontendUrl =
        config.node_env !== 'development'
          ? (config.verify_link.user_verify_link as string)
          : (config.verify_link.user_production_url as string)
      break
    case Role.AGENT:
      frontendUrl =
        config.node_env !== 'development'
          ? (config.verify_link.agent_verify_link as string)
          : (config.verify_link.agent_production_url as string)
      break
    case Role.SUPER_ADMIN :
      frontendUrl =
        config.node_env !== 'development'
          ? (config.verify_link.admin_verify_link as string)
          : (config.verify_link.admin_production_url as string)
      break
    default:
      throw new Error('Invalid role!')
  }
  return `${frontendUrl}/auth/${actionType}?token=${token}`
}