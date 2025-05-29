import axios from 'axios'
import { MINDS_OF_TIME_SERVICE_URL } from '../config'

export const fetchProminentPersons = async (): Promise<{ name: string }[]> => {
    const { data: prominentPersons } = await axios.get(`${MINDS_OF_TIME_SERVICE_URL}/v1/minds-of-time/prominent-persons`)

    return prominentPersons
}
