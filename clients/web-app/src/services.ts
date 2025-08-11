import axios from "axios";
import { Character } from "utils/types";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
});

export const sendMessage = async (
  message: string,
  contextId: string,
  character: Character,
  errorRate: number,
  signal: AbortSignal
) => {
  return instance.post(
    `/v1/timegate/dialogue-hub/openrouter/message`,
    {
      message: `${message} ${
        !character
          ? ""
          : `. Answer short, assume you are the ${character.name}, respond in first person as if you are that character, using this answer style: ${character.answerStyle}`
      }`,
      ...(contextId ? { contextId } : {}),
    },
    {
      params: {
        errorRate,
      },
      signal,
    }
  );
};

// Dummy requests to generate traces
export const getEpoch = async () => {
  try {
    await instance.get(`/v1/epoch-engine/epoch`);
    console.log("Epoch fetched successfully");
  } catch (error) {
    console.error("Error fetching epoch:", error);
  }
};

export const getProminentPersons = async () => {
  try {
    await instance.get(`/v1/minds-of-time/prominent-persons`);
    console.log("Prominent persons fetched successfully");
  } catch (error) {
    console.error("Error fetching prominent persons:", error);
  }
};

export const getTimegateEpoch = async () => {
  try {
    await instance.get(`/v1/timegate/epoch-engine/epoch`);
    console.log("Timegate epoch fetched successfully");
  } catch (error) {
    console.error("Error fetching Timegate epoch:", error);
  }
};

export const getHistoricalEvents = async () => {
  try {
    await instance.get(`/v1/vault-of-time/historical-events`);
    console.log("Historical events fetched successfully");
  } catch (error) {
    console.error("Error fetching historical events:", error);
  }
};

export const getTimegateHistoricalEvents = async () => {
  try {
    await instance.get(`/v1/timegate/vault-of-time/historical-events`);
    console.log("Timegate historical events fetched successfully");
  } catch (error) {
    console.error("Error fetching Timegate historical events:", error);
  }
};

export const getTimegateProminentPersons = async () => {
  try {
    await instance.get(`/v1/timegate/minds-of-time/prominent-persons`);
    console.log("Timegate Prominent persons fetched successfully");
  } catch (error) {
    console.error("Error fetching Timegate prominent persons:", error);
  }
};
