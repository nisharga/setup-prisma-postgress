import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "./apiError"; 


interface CustomRequest extends Request {
 role?: string;
}

const validateAuthorization = (allowedRoles: string[]) => {
 return async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
   const currentRole = req.role;
   if (
    allowedRoles.length &&
    currentRole &&
    !allowedRoles.includes(currentRole)
   ) {
    throw new ApiError(
     httpStatus.FORBIDDEN,
     "You are not allowed to perform this action",
    );
   }
   next();
  } catch (error) {
   next(error);
  }
 };
};

export default validateAuthorization;
