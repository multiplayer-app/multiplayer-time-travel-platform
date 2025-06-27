import axios from 'axios'
import restify from 'restify-errors'
import { randomUUID } from 'crypto'
import { redis } from '../libs'
import {
    OPENROUTER_API_KEY,
    OPENROUTER_API_URL,
    OPENROUTER_MODEL,
    REDIS_OPENROUTER_CTX_CACHE_PREFIX
} from '../config'

export const postOpenRouterMessage = async (
    message: string,
    contextId?: string,
): Promise<{ reply: string, contextId: string }> => {
    try {
        let messages: { role: string, content: string }[] = []

        if (contextId) {
            const cachedMessages = await redis.get(`${REDIS_OPENROUTER_CTX_CACHE_PREFIX}${contextId}`)
            if (cachedMessages?.length) {
              messages = cachedMessages
            }
        } else {
            contextId = randomUUID()
        }

        messages.push({
            role: 'user',
            content: message
        })


        await redis.set(
            `${REDIS_OPENROUTER_CTX_CACHE_PREFIX}${contextId}`,
            messages
        )

        const res = await axios.post(
            OPENROUTER_API_URL,
            {
                model: OPENROUTER_MODEL,
                messages
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`
                }
            }
        )

        return {
            reply: res.data?.choices?.[0]?.message?.content || '',
            contextId
        }
    } catch (error: any) {
        if (
            error?.response?.data?.code?.startsWith('WARP_ENGINE_ERROR')
            && error?.response?.data?.message
        ) {
            const wrappedError = new restify.HttpError(error?.response?.data?.message) as any
            wrappedError.statusCode = 502
            wrappedError.code = error?.response?.data?.code

            throw wrappedError
        }

        throw error
    }
}
