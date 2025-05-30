import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
});

export const submitEmail = async (email) => {
  return instance.post(`/v1/timegate/user/info/email`, { email });
};

export const sendMessage = async (message, contextId, character) => {
  return instance.post(
    `/v1/timegate/dialogue-hub/openrouter/message`,
    {
      message: `${message} ${contextId ? "" : `. Answer like you are the ${character.name}, using this answer style: ${character.answerStyle}`}`,
      ...(contextId ? { contextId } : {}),
    }
  );
};

// Dummy requests to generate traces
export const getEpoch = async () => {
  try {
    await instance.get(`/v1/timegate/epoch-engine/epoch`);
    console.log('Epoch fetched successfully');
  } catch (error) {
    console.error('Error fetching epoch:', error);
  }
};

export const getHistoricalEvents = async () => {
  try {
    await instance.get(`/v1/timegate/vault-of-time/historical-events`);
  } catch (error) {
    console.log('Historical events fetched successfully');
    console.error('Error fetching historical events:', error);
  }
};

export const getProminentPersons = async () => {
  try {
    await instance.get(`/v1/timegate/minds-of-time/prominent-persons`);
    console.log('Prominent persons fetched successfully');
  } catch (error) {
    console.error('Error fetching prominent persons:', error);
  }
};
