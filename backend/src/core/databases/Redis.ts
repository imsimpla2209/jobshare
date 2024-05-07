/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-var-requires */
import config from '@config/config'
import { logger } from 'common/logger'
import Redis, { Redis as RedisClient } from 'ioredis'

export default class RedisHandler {
  client: RedisClient

  constructor() {
    this.client = new Redis({
      host: config.redis.host, // Redis server host
      port: config.redis.port, // Redis server port
      connectTimeout: 1000,
      maxRetriesPerRequest: 5,
    })

    this.client.on('connect', () => {
      logger.info('Connected to Redis')
    })

    this.client.on('error', err => {
      logger.error('Redis error:', err)
    })
  }

  public async setValue(key: string, value: string): Promise<void> {
    try {
      await this.client.set(key, value)
    } catch (error) {
      logger.error('Error setting value in Redis:', error)
      throw error
    }
  }

  public async setWithExpiration(key: string, value: string, seconds: number): Promise<void> {
    try {
      await this.client.setex(key, seconds, value)
    } catch (error) {
      logger.error('Error setting value with expiration in Redis:', error)
      throw error
    }
  }

  public async getValue(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key)
      return value
    } catch (error) {
      logger.error('Error getting value from Redis:', error)
      throw error
    }
  }

  public async deleteKey(key: string): Promise<number> {
    try {
      const deletedCount = await this.client.del(key)
      return deletedCount
    } catch (error) {
      logger.error('Error deleting key from Redis:', error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.disconnect()
    logger.warn('Disconnected from Redis')
  }
}

const redisInsance = new RedisHandler()
export { redisInsance }
