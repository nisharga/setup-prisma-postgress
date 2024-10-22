import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod' 
import { ErrorHandler } from '../errors/errors'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Prisma } from '@prisma/client'
import httpStatus from 'http-status'
import ApiError from './apiError'
import { JsonWebTokenError } from 'jsonwebtoken'
import { IErrorSources } from '../errors/error.interface'

class GlobalErrorHandler {
  handlers(error: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500
    let message = 'Something went wrong'
    let errorSources: IErrorSources[] = [
      { path: '', message: error.message || 'Something went wrong' },
    ]

    if (error instanceof ApiError) {
      statusCode = error?.statusCode
      message = error.message
      errorSources = [{ path: '', message: error.message }]
    } else if (error instanceof JsonWebTokenError) {
      statusCode = httpStatus.FORBIDDEN
      message = error.message
      errorSources = [{ path: '', message: error.message }]
    } else if (error instanceof ZodError) {
      const simplifiedError = ErrorHandler.handleZodError(error)
      statusCode = simplifiedError.statusCode
      message = simplifiedError.message
      errorSources = simplifiedError.errorSources
    } else if (error.code === 'P2025') {
      statusCode = httpStatus.NOT_FOUND
      message = error.message
      errorSources = [{ path: '', message: error.message }]
    } else if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const simplifiedError = ErrorHandler.handleDuplicateError(error)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources
      } else if (error.code === 'P2003') {
        const simplifiedError = ErrorHandler.handleCastError(error)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources
      } else if (error.code === 'P2025') {
        // Record not found
        const simplifiedError = ErrorHandler?.handleNotFoundError(error) // Use handleNotFoundError for 'P2025'
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      const simplifiedError = ErrorHandler.handleValidationError(error)
      statusCode = simplifiedError.statusCode
      message = simplifiedError.message
      errorSources = simplifiedError.errorSources
    }

    return res.status(statusCode).json({
      success: false,
      message: message,
      errorSources: errorSources || {
        path: '',
        message: message,
      },
      stack: error?.stack,
    })
  }
}

export const globalErrorHandler = new GlobalErrorHandler()
