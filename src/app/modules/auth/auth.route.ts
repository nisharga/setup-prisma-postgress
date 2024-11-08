import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidations } from "./auth.validation";

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

export const authRoutes = router;