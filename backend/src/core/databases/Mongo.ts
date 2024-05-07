/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose'
import config from '@config/config'
import logger from 'common/logger/logger'

class DataBase {
  static instance: any

  constructor() {
    this.initiateMongoServer()
  }

  // eslint-disable-next-line class-methods-use-this
  async initiateMongoServer(_type = 'mongoDb'): Promise<void> {
    if (config.env === 'development') {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    mongoose
      .connect(config.mongoose.url, { maxPoolSize: config.mongoose.poolSize })
      .then(() => {
        logger.info('Connected to MongoDB')
      })
      .catch(err => {
        logger.error(`Cannot connect to DB!!, log:`, err)
        throw err
      })
  }

  static getInstance() {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase()
    }
    return DataBase.instance
  }
}

const instanceMongoDb = DataBase.getInstance()
export default instanceMongoDb
