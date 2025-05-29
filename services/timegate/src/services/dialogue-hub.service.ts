import axios from 'axios'
import { DIALOGUE_HUB_SERVICE_URL } from '../config'

export const postOpenRouterMessage = async (message: string, contextId?: string): Promise<{ reply: string, contextId: string }> => {
    const res = await axios.post(
        `${DIALOGUE_HUB_SERVICE_URL}/v1/dialogue-hub/openrouter/messages`,
        {
            message,
            ...contextId ? {contextId} : {}
        }
    )

    res.data
    return res.data
}
