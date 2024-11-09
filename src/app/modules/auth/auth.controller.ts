import BaseController from "../../shared/baseController";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import { Request, Response } from 'express'

class Controller extends BaseController {
    register = this.catchAsync(async (req, res, next) => {
        const payload = req.body;
        const result = await AuthService.registerUser(payload);
        this.sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User created successfully!",
            data: result
        });
    }); 

    loginUser = this.catchAsync(async (req: Request, res: Response) => { 
        const result = await AuthService.loginUser(req.body)
        const { refreshToken } = result
        res.cookie('refreshToken', refreshToken, {
          secure: false,
          httpOnly: true,
        })
        this.sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: 'User Logged in successfully',
          data: result,
        })
      })

    forgotPassword = this.catchAsync(async (req: Request, res: Response) => {
      const result = await AuthService.forgotPassword(req.body)
      this.sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Check your Email to reset your password',
        data: result,
      })
    })
  
    resetPassword = this.catchAsync(async (req: Request, res: Response) => {
      const { token } = req.query || ''
      const result = await AuthService.resetPassword(token as string, req.body)
      this.sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password reset successfully ',
        data: result,
      })
    })

    verifyEmail = this.catchAsync(async (req: Request, res: Response) => {
      const { token } = req.query || ''
      const result = await AuthService.verifyEmail(token as string)
      this.sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Email Verified successfully !',
        data: result,
      })
    })

    refreshToken = this.catchAsync(async (req: Request, res: Response) => {
      const { refreshToken } = req.cookies || ''
      const result = await AuthService.refreshToken(refreshToken as string)
      this.sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Generate new tokens successfully!',
        data: result,
      })
    })
  
    decodedToken = this.catchAsync(async (req: Request, res: Response) => {
      const token = req?.headers?.authorization || ''
      const result = await AuthService.decodedUser(token)
      this.sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Token Decoded successfully!',
        data: result,
      })
    })
  
    changePassword = this.catchAsync(async (req, res, next) => {
      const result = await AuthService.changePassword(req.id as string, req.body)
      this.sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password changed successfully!',
        data: result,
      })
    })
  
    socialLogin = this.catchAsync(async (req, res, next) => {
      const result = await AuthService.socialLogin(req.body)
      const { refreshToken } = result
      res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true,
      })
      this.sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logged in successfully!',
        data: result,
      })
    })

    updateProfile = this.catchAsync(async (req, res, next) => {
      const userId = req.id
      const updateData = req.body
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      const imageUrl = files.imageUrl ? files.imageUrl[0].path : null 
  
      const result = await AuthService.updateProfile(
        updateData,
        userId as string,
        imageUrl as string
      )
      this.sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Profile Update successfully !',
        data: result,
      })
    }) 
}

export const AuthController = new Controller();
