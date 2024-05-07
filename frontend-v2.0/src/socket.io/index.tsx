import { createContext, useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from 'src/Components/Providers/AuthProvider'
import { SERVER_ENPOINT } from 'src/api/server-url'
import { ESocketEvent } from 'src/utils/enum'

export const socket = io(SERVER_ENPOINT, {
  transports: ['websocket', 'polling'],
})

const SocketContext = createContext(null)

export const SocketProvider = props => {
  const { authenticated, id } = useAuth();

  useEffect(() => {
    if (authenticated) {
      socket.on('connect', () => {
        socket.emit(ESocketEvent.USER_CONNECTED, { socketId: socket.id, userId: id })
        console.log('my socket id', socket.id);
      })
    }
    return () => {
      if (authenticated) {
        socket.emit(ESocketEvent.USER_DISCONNECTED, { socketId: socket.id, userId: id })
        socket.off('connect')
      }
    }
  }, [authenticated, id])

  return <SocketContext.Provider value={{ appSocket: socket }}>
    {props.children}
  </SocketContext.Provider>
}

export const useSocket = () => {
  const { appSocket } = useContext(SocketContext)
  return {
    appSocket,
  }
}
