import axios from 'axios'
import { DIALOGUE_HUB_SERVICE_URL } from '../config'

export const postOpenRouterMessage = async (message: string, contextId?: string): Promise<{ reply: string, contextId: string }> => {
    try {
        const res = await axios.post(
            `${DIALOGUE_HUB_SERVICE_URL}/v1/dialogue-hub/openrouter/messages`,
            {
                message,
                ...contextId ? {contextId} : {}
            }
        )

        return res.data
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send message to OpenRouter'
        throw new Error(errorMessage)
    }
}
