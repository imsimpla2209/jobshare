import { logger } from 'common/logger'
import mongoose from 'mongoose'
import os from 'os'
import process from 'process'

const checkConnectionStatus = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Not real practical number;
    const maxConnections = numCores * 10

    logger.info(`Number of active DB connections::${numConnections}`)
    logger.info(`Memory usage::${memoryUsage / 1024 / 1024} MB`)

    if (numConnections > maxConnections) {
      logger.warn('Connections overload detected!!')
    }
  }, Number(process.env.CHECK_TIME_MS))
}

export default checkConnectionStatus
