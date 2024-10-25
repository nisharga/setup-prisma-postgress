import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path' 
import { globalErrorHandler } from './app/middlewares'
import router from './app/routes'
 

dotenv.config()
const app: Application = express()
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.get('/', async (req, res) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'DiasporeX is running!',
    data: null,
  })
})

app.use('/api/v1', router)

app.use('/uploads', express.static(path.join('uploads')))
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})
app.use(globalErrorHandler.handlers)
export default app
