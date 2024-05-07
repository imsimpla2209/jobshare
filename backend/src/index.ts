import mongoose from 'mongoose'
import app from './app'
import config from './config/config'
import logger from './common/logger/logger'
import { SocketIO, injectSocket } from './core/libs/SocketIO'
import dbChecker from './core/libs/dbCheck.connect'

require('./core/databases/Mongo')

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`)
  logger.info(`Docs available at ${config.apiHost}/docs`)
  dbChecker()
})

const io = new SocketIO(server)
app.set('socketio', io)

injectSocket(io)

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: string) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGINT', () => {
  mongoose.connection.close()
  logger.info('Mongoose disconnected on app termination')
  process.exit(0)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
