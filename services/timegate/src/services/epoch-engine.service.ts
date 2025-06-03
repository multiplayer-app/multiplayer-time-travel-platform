import axios from 'axios'
import restify from 'restify-errors'
import { EPOCH_ENGINE_SERVICE_URL } from '../config'

interface HistoricalDate {
    name: string
    startDate: {
        isBCE: boolean
        date: string
        bceString: string | null
    }
    endDate: {
        isBCE: boolean
        date: string
        bceString: string | null
    }
}

export const fetchEpochs = async (
    errorRate?: number
): Promise<HistoricalDate[]> => {
    try {
        const { data: epochs } = await axios.get(
            `${EPOCH_ENGINE_SERVICE_URL}/v1/epoch-engine/epoch`,
            { ...errorRate ? { params: { errorRate } } : {} }
        )

        return epochs
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
