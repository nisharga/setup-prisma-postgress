import prisma from "../../../prisma-client/prisma"
import bcrypt from 'bcrypt'
import { ActionType, generateActionLink, generateEmailVerifyToken, generateTokens } from "./auth.utlis"
import { mailService } from "../../shared/mailService/mailService"
import ApiError from "../../middlewares/apiError"
import httpStatus from 'http-status'
import { User } from "@prisma/client"

class Service {
  async registerUser(payload: User) {
    const hashedPassword = await bcrypt.hash(payload.password, 12)
     
    const createUser = await prisma.user.create({
      data: {
        ...payload,
        name: payload.name,
        password: hashedPassword,
      },
    })
    const { password, ...userWithoutPassword } = createUser
    const { name, email, role } = createUser
    const emailVerifyToken = generateEmailVerifyToken(createUser)

    const emailVerificationLink = generateActionLink(
      role,
      emailVerifyToken,
      ActionType.emailVerify,
    )
    await mailService.sendEmail(
      'verifyEmail',
      email,
      name,
      emailVerificationLink,
    )
    return userWithoutPassword
  }

  async loginUser(payload: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
        isVerified: true,
      },
    })
    if (!user) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `No verified user account found.`,
      )
    }
    const isPasswordMatched = await bcrypt.compare(
      payload.password,
      user.password,
    )
    if (!isPasswordMatched) {
      throw new ApiError(httpStatus.FORBIDDEN, 'password is incorrect')
    }
    const result = generateTokens(user)
    return result
  }
}
export const AuthService = new Service()

 