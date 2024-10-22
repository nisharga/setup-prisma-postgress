import { NextFunction, Request, Response } from "express";
import { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "./apiError";  
import { jwtHelpers } from "../helpers";
import config from "../../config";

// Define a custom type for extending the Request object
type CustomRequest = Request & {
 id?: string;
 email?: string;
 role?: string;
};

// Define a custom type for extending the JWT Payload object
type CustomJWTPayload = JwtPayload & {
 id?: string;
 email?: string;
 role?: string;
};

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
 const token = req.headers.authorization;
 if (token) {
  const isVerified: CustomJWTPayload | null = jwtHelpers.verifyToken(
   token,
      config.secret_access_token as Secret,
  );
  if (!isVerified) {
   throw new ApiError(400, "Invalid token");
  } else {
   // Assign custom properties to the req object
   req.id = isVerified?.id as string;
   req.email = isVerified?.email as string;
   req.role = isVerified?.role as string;

   next();
  }
 } else {
  throw new ApiError(400, "Token not found");
 }
};

export default verifyToken;
