import { type Server } from 'http'
import socketIo from 'socket.io'
import { API_PREFIX } from './config'
import { DialogueHubService } from './services'
import { logger } from './libs'

export let io

export const start = async (httpServer: Server) => {
    io = new socketIo.Server(httpServer, {
        cors: {
            origin: '*'
        },
        path: `${API_PREFIX}/ws`,
    })

    io.on('connection', onUserConnection)
}

const onUserConnection = async (socket) => {
    try {
        socket.once('disconnect', onUserDisconnect)

        logger.debug('[Websocket] Connected user')

        socket.on('message', async (data: { message: string, contextId?: string }) => {
            logger.debug({
                event: 'message',
                data
            }, '[Websocket] Received message')

            const reply = await DialogueHubService.postOpenRouterMessage(
                data.message,
                data.contextId
            )

            socket.emit('reply', reply)
        })

    } catch (error) {
        logger.error(error, '[Websocket] Error happened in socket handler')
    }
}

const onUserDisconnect = () => {
    logger.debug('[Websocket] Disconnected user')
}
