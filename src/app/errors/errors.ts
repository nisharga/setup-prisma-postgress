import { ZodError } from "zod"; 
import { Prisma } from "@prisma/client";
import { IErrorSources } from "./error.interface";
import config from "../../config";


class ErrorHandlers {
    handleZodError(error: ZodError) {
        let zodMessage: string = '';
        const errorSources: IErrorSources[] = error.issues.map(issue => {
            zodMessage += `${issue.message}.`; // Concatenate messages with a newline separator
            return {
                path: issue?.path[issue.path.length - 1],
                message: issue?.message,
            }
        });
        const statusCode = 400;
        return {
            statusCode,
            success: false,
            message: zodMessage.trim(), // Trim any trailing newline characters
            errorSources,
            stack: config.env === 'development' ? error?.stack : null,
        };
    }
    /* Prisma validation error */
    handleValidationError(error: Prisma.PrismaClientValidationError) {
        const errorSources: IErrorSources[] = [
            {
                path: '',
                message: error.message,
            },
        ];
        const statusCode = 400;
        return {
            statusCode,
            success: false,
            message: error.message,
            errorSources,
        };
    }
    /* Prisma duplicate error */
    handleDuplicateError(error: Prisma.PrismaClientKnownRequestError) {
        // @ts-ignore
        const errorSources: IErrorSources[] = error?.meta?.target.map((field: string) => ({
            path: field,
            message: `Already exists.`,
        }));
        const statusCode = 409;
        return {
            statusCode,
            success: false,
            message: 'Already exits',
            errorSources,
        };
    }
    /* Prisma cast error */
    handleCastError(error: Prisma.PrismaClientKnownRequestError) {
        const errorSources: IErrorSources[] = [
            {
                path: '',
                message: 'Invalid data type provided.',
            },
        ];
        const statusCode = 400;
        return {
            statusCode,
            success: false,
            message: 'Cast Error',
            errorSources,
        };
    }

     /* Prisma not found error */
     handleNotFoundError(error: Prisma.PrismaClientKnownRequestError) {
        const errorSources: IErrorSources[] = [
            {
                path: '',
                message: 'No record found.',
            },
        ];
        const statusCode = 404;
        return {
            statusCode,
            success: false,
            message: 'No record found',
            errorSources,
        };
    }
}
export const ErrorHandler = new ErrorHandlers();
