import prisma from "../../../prisma-client/prisma"
import bcrypt from 'bcrypt'
import { ActionType, generateAccessToken, generateActionLink, generateEmailVerifyToken, generateRefreshToken, generateResetToken, generateTokens } from "./auth.utlis"
import { mailService } from "../../shared/mailService/mailService"
import ApiError from "../../middlewares/apiError"
import httpStatus from 'http-status'
import { User } from "@prisma/client"
import { jwtHelpers } from "../../helpers"
import config from "../../../config"
import { JwtPayload } from "jsonwebtoken"
import { CloudinaryResponse, sendImageToCloudinary } from "../../shared"

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

  async forgotPassword(payload: { email: string }) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: payload.email 
      },
    })
    const resetToken = generateResetToken(user)
    const resetPassLink = generateActionLink(
      user.role,
      resetToken,
      ActionType.resetPassword,
    )
    await mailService.sendEmail(
      'resetPassword',
      user.email,
      user.name,
      resetPassLink,
    )
  }

  async resetPassword(token: string, payload: { password: string }) {
    const validToken = jwtHelpers.verifyToken(
      token,
      config.reset_pass_token as string,
    )

    if (!validToken) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token provided')
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: validToken.id 
      },
    })
    const hashedPassword = await bcrypt.hash(payload.password, 12)
    const resetPassword = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    return resetPassword
  }

  async verifyEmail(token: string) {
    const user = jwtHelpers.verifyToken(
      token,
      config.email_verify_token as string,
    )


    if (!user) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token provided')
    }
    await prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    })
    const result = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        isVerified: true,
      },
      select: {
        name: true, 
        email: true,
        isVerified: true,
        password: false,
      },
    })
    return result
  }

  async refreshToken(token: string) {
    let decodedToken: JwtPayload
    try {
      decodedToken = jwtHelpers.verifyToken(
        token,
        config.refresh_token as string,
      )
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access!')
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: decodedToken.email,
        isVerified: true
      },
    })
    const newRefreshToken = generateRefreshToken(user)
    const newAccessToken = generateAccessToken(user)
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }
  async decodedUser(token: string) {
    let decodedToken: JwtPayload
    try {
      decodedToken = jwtHelpers.verifyToken(
        token,
        config.secret_access_token as string,
      )
      const { name, email, role } = decodedToken
      return {
        name,
        email,
        role,
      }
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access!')
    }
  }
  async changePassword(
    id: string,
    payload: { oldPassword: string; newPassword: string },
  ) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    })
    const isCorrect = await bcrypt.compare(payload.oldPassword, user.password)
    if (!isCorrect) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect!')
    }
    const hashPassword = await bcrypt.hash(payload.newPassword as string, 12)
    await prisma.user.update({
      where: { id },
      data: { password: hashPassword },
    })
    return null
  }

  async socialLogin(payload: User) {
    const hashPassword = await bcrypt.hash('12345678', 12)
    const userPassword =
      payload.password && (await bcrypt.hash(payload.password, 12)) 
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    })
    if (user) {
      return generateTokens(user)
    }
    const newUser = await prisma.user.create({
      data: {
        ...payload, 
        imageUrl: payload.imageUrl,
        isVerified: true,
        password: userPassword || hashPassword,
      },
    })
    return generateTokens(newUser)
  }

  async updateProfile(
    updateData: any,
    userId: string,
    imageUrl: string
  ) { 

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    }) 
 
    const publicImg = `${userId}-${user.name}`

    if (imageUrl) {
      const imageUrlLink = await sendImageToCloudinary(publicImg, imageUrl)
      updateData.imageUrl = (imageUrlLink as CloudinaryResponse).secure_url 
    }
 
    try {  
        const result = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            ...updateData
          },
        })
        return result 
    } catch (error: any) {
      throw new ApiError(httpStatus.NOT_FOUND, error.message)
    }
  }

}
export const AuthService = new Service()

 