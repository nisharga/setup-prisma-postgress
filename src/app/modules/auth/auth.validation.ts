import { z } from 'zod'

// Enum validation
const RoleEnum = z.enum(['USER', 'AGENT'])
const StatusEnum = z.enum(['ACTIVE', 'BLOCKED'])

// User schema validation
const passwordValidationSchema = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[`~<>?,./!@#$%^&*()\-_=+\\|[\]{};:'",]/,
    'Password must contain at least one special character',
  )

export const nameValidation = z
  .string({
    invalid_type_error: 'Name must be a string',
  })
  .trim()
  .min(2, 'Full name must be at least 2 characters')
  .max(50, 'Full name must not exceed 50 characters')
  .regex(
    /^[A-Za-zÀ-ÖØ-öø-ÿ .]+$/,
    'Name can only contain letters, spaces, and dots',
  )
  .refine(val => {
    return !/(\'|\.)(\1)+/.test(val)
  }, 'Name cannot contain consecutive apostrophes or dots')
  .refine(val => {
    return !/(.)\1\1/.test(val)
  }, 'Name cannot have more than 2 consecutive identical characters')
const userRegisterSchemaValidation = z.object({
  body: z.object({
    name: nameValidation,
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email('Invalid email address'),
    password: passwordValidationSchema,

    phoneNumber: z
      .string({
        invalid_type_error: 'Phone number must be a string',
      })
      .optional(),

    address: z
      .string({
        invalid_type_error: 'Address must be a string',
      })
      .optional(),
  }),
})

const userLoginValidation = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: passwordValidationSchema,
  }),
})

const changePasswordValidation = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
      invalid_type_error: 'Invalid type',
    }),
    newPassword: passwordValidationSchema,
  }),
})

export const forgetPasswordValidation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email({ message: 'Please provide a valid email address' }),
  }),
})

export const resetPasswordValidation = z.object({
  body: z.object({
    password: passwordValidationSchema,
  }),
})

export const authValidations = {
  userRegisterSchemaValidation,
  userLoginValidation,
  changePasswordValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
}
