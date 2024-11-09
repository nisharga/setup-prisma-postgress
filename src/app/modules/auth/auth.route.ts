import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidations } from "./auth.validation";
import validateAuthorization from "../../middlewares/validateAuthorization";
import { Role } from "@prisma/client";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.post(
    '/register',
    validateRequest(authValidations.userRegisterSchemaValidation),
    AuthController.register,
  )
  
  router.post(
    '/login',
    validateRequest(authValidations.userLoginValidation),
    AuthController.loginUser,
  )

  router.post(
    '/forgot-password',
    validateRequest(authValidations.forgetPasswordValidation),
    AuthController.forgotPassword,
  )
  router.post(
    '/reset-password',
    validateRequest(authValidations.resetPasswordValidation),
    AuthController.resetPassword,
  )

  router.post('/verify-email', AuthController.verifyEmail)

  router.post(
    '/refresh-token',
    verifyToken,
    validateAuthorization([Role.SUPER_ADMIN, Role.AGENT, Role.USER]),
    AuthController.refreshToken,
  )
  
  router.post('/decode-token', AuthController.decodedToken)
  
  router.post(
    '/change-password',
    verifyToken,
    validateAuthorization([Role.SUPER_ADMIN, Role.AGENT, Role.USER]),
    validateRequest(authValidations.changePasswordValidation),
    AuthController.changePassword,
  )

  router.post('/social-login', AuthController.socialLogin)

export const authRoutes = router;