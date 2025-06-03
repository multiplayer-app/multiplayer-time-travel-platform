import axios from 'axios'
import restify from 'restify-errors'
import { VAULT_OF_TIME_SERVICE_URL } from '../config'

export const fetchHistoricalEvents = async (
    errorRate?: number
): Promise<{ event: string, name: string }[]> => {
    try {
        const { data: historicalEvents } = await axios.get(
            `${VAULT_OF_TIME_SERVICE_URL}/v1/vault-of-time/historical-events`,
            { ...errorRate ? { params: { errorRate } } : {} }
        )

        return historicalEvents
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
