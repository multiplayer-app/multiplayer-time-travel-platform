import axios from 'axios'
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

export const fetchEpochs = async (): Promise<HistoricalDate[]> => {
    const { data: epochs } = await axios.get(`${EPOCH_ENGINE_SERVICE_URL}/v1/epoch-engine/epoch`)

    return epochs
}
