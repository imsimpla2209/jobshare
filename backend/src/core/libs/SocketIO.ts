/* eslint-disable global-require */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as socketio from 'socket.io'
import logger from 'common/logger/logger'
import { ESocketEvent } from 'common/enums'
import RedisHandler from '@core/databases/Redis'

export interface SocketIOData {
  socketio: SocketIO
  socket: socketio.Socket
}

export class SocketIO {
  private io: socketio.Socket

  private redisHandler: RedisHandler // Instance of RedisHandler

  public onlineUsers: any = {}

  constructor(server: Express.Application) {
    logger.info('Socket.io', 'Started')
    this.io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })
    this.redisHandler = new RedisHandler()
    this.init()
  }

  public async getAllOnlineUsers(): Promise<any[]> {
    // const keys = await this.redisHandler.client.smembers('online_users')
    // const users = await this.redisHandler.client.mget(...keys)
    const keys = await this.redisHandler.client.keys('online_users:*')
    const onlineUsers = keys?.map(key => key?.split(':')[1])
    return onlineUsers
  }

  public async getAllOnlineUsersWithSocket(): Promise<any[]> {
    // const keys = await this.redisHandler.client.smembers('online_users')
    const keys = await this.redisHandler.client.keys('online_users:*')
    const users = await this.redisHandler.client.mget(...keys)
    return users?.map(s => JSON.parse(s))
  }

  public async getOnlineUserWithSocket(userId: string): Promise<any[]> {
    // const keys = await this.redisHandler.client.smembers('online_users')
    // const keys = await this.redisHandler.client.keys('online_users:*')
    const users = await this.redisHandler.client.get(`online_users:${userId}`)
    return JSON.parse(users)
  }

  private async init() {
    this.io.on('connect', async (socket: socketio.Socket) => {
      logger.warn('NEW CONNECTION', socket.id)
      socket.on(ESocketEvent.USER_CONNECTED, async (user: any) => {
        logger.warn(`USER CONNECTION: ${user?.userId}`)
        // this.onlineUsers[user?.userId] = { socketId: user?.socketId, socket }
        await this.redisHandler.setValue(`online_users:${user?.userId}`, JSON.stringify({ socketId: user?.socketId }))
        /**
         * OPTIONAL NOTE:
         * BROADCAST IF NEW LOGGIN HAS BEEN RECEIVED
         */
        this.broadcastAll(ESocketEvent.USER_CONNECTED, { user })
      })
      socket.on(ESocketEvent.USER_DISCONNECTED, async (user: any) => {
        logger.warn(`USER OFFLINE: ${user?.userId}`)
        // delete this.onlineUsers[user?.userId]
        await this.redisHandler.deleteKey(`online_users:${user?.userId}`)

        /**
         * OPTIONAL NOTE:
         * BROADCAST IF NEW LOGGIN HAS BEEN RECEIVED
         */
        this.broadcastAll(ESocketEvent.USER_CONNECTED, { user })
      })
      /**
       * OPTIONAL NOTE:
       * BROADCAST IF NEW CONNECTION HAS BEEN RECEIVED
       */
      this.broadcastAll('new_connection', { socket_id: socket.id })

      /**
       * BROADCAST IF SOMEONE GOT DISCONNECTED EXCEPT SENDER
       */
      socket.on('disconnect', async (user: any) => {
        logger.error('SOCKET DISCONNECTED', socket.id, this.onlineUsers)
        await this.redisHandler.deleteKey(`online_users:${user?.userId}`)

        /** OPTIONAL NOTE: Implement disconnect event on client side */
        // socket.broadcast.emit('disconnect_connection', socket.id)
      })
    })
  }

  /** Use io.emit to broadcast event to all connected clients */
  broadcastAll(event: string, payload: unknown): void {
    // logger.info('BROADCASTING', `Clients: ${Object.keys(this.clients).length}`)
    this.io.emit(event, payload)
  }

  /** SEND TO SPECIFIC ID */
  sendToId(socket_id: string, event: string, payload: unknown): void {
    logger.info(`SENDING TO SPECIFIC ID:${socket_id}`)
    this.io.to(socket_id).emit(event, payload)
  }
}

let io

export const injectSocket = (s: SocketIO) => {
  io = s
}

export { io }
