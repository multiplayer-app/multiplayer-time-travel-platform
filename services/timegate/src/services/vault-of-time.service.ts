import axios from 'axios'
import { VAULT_OF_TIME_SERVICE_URL } from '../config'

export const fetchHistoricalEvents = async (): Promise<{event: string, name: string}[]> => {
    const { data: historicalEvents } = await axios.get(`${VAULT_OF_TIME_SERVICE_URL}/historical-events`)

    return historicalEvents
}
