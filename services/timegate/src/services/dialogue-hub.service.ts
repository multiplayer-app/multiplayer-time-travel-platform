import axios from 'axios'
import restify from 'restify-errors'
import { DIALOGUE_HUB_SERVICE_URL } from '../config'

export const postOpenRouterMessage = async (
    message: string,
    contextId?: string,
    errorRate?: number
): Promise<{ reply: string, contextId: string }> => {
    try {
        const res = await axios.post(
            `${DIALOGUE_HUB_SERVICE_URL}/v1/dialogue-hub/openrouter/messages`,
            {
                message,
                ...contextId ? { contextId } : {}
            },
            { ...errorRate ? { params: { errorRate } } : {} }
        )

        res.data
        return res.data
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
