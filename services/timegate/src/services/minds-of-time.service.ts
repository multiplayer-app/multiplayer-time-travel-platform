import axios from 'axios'
import restify from 'restify-errors'
import { MINDS_OF_TIME_SERVICE_URL } from '../config'

export const fetchProminentPersons = async (
    errorRate?: number
): Promise<{ name: string }[]> => {
    try {
        const { data: prominentPersons } = await axios.get(
            `${MINDS_OF_TIME_SERVICE_URL}/v1/minds-of-time/prominent-persons`,
            { ...errorRate ? { params: { errorRate } } : {} }
        )

        return prominentPersons
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
