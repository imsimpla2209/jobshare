import passport from '@config/passport'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import httpStatus from 'http-status'
import xss from 'xss-clean'
import { ApiError, errorConverter, errorHandler } from './common/errors'
import { morgan } from './common/logger'
import config from './config/config'
import routes from './routes/v1'
import { authLimiter } from './utils'

const app: Express = express()

if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

// set security HTTP headers
app.use(helmet())

// enable cors
const corsOptions = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  // ['http://127.0.0.1:6996', 'http://localhost:6996'],
  'Access-Control-Allow-Headers': 'origin, X-Requested-With,Content-Type,Accept, Authorization, Content-Type',
  methods: 'GET,POST,DELETE,PUT,PATCH',
  Accept: 'application/json',
  origin: true,
  // ['http://127.0.0.1:6996', 'http://localhost:6996'],
  credentials: true,
  withCredentials: true,
}
app.use(cors(corsOptions))
app.options('*', cors())

// parse json request body
app.use(express.json())

/** Remove X-Powered-By */
app.disable('x-powered-by')

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// sanitize request data
app.use(xss())
app.use(ExpressMongoSanitize())

// gzip compression
app.use(compression())

// Cookie
app.use(cookieParser())

// app.use(session())

// authentication
app.use(passport.initialize())

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter)
}

// v1 api routes
app.use('/v1', routes)

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

export default app
