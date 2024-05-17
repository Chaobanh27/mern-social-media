/* eslint-disable no-console */
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import helmet from 'helmet'
import { APIs } from './routes/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import { env } from './config/environment.js'
import cors from 'cors'
import { corsOptions } from './config/corsOptions.js'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()

  app.use(helmet())
  app.use(express.json())
  app.use(morgan('dev'))
  app.use(cookieParser())
  app.use(cors(corsOptions))
  app.use('/api', APIs)

  app.use(errorHandlingMiddleware)

  app.listen(env.PORT, () => {
    console.log('server is running at port 3000')
  })
}


console.log('Connecting to MongoDB CLoud Atlas...')

mongoose.connect(`${env.MONGODB_URI}`)
  .then(() => {
    console.log('connected to mongodb')
    START_SERVER()
  })
  .catch((err) => {
    console.error('Error connecting to MongoDb Atlas', err)
  })