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
}

export const AuthController = new Controller();
