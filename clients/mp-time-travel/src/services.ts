import axios from "axios";

export const submitEmail = async (email) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_BASE_API_URL}/v1/timegate/user/info/email`,
      {
        email,
      }
    );
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (message, contextId, character) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_BASE_API_URL}/v1/dialogue-hub/openrouter/messages`,
      {
        message:
          message +
          (contextId
            ? ""
            : `. Answer like you are the ${character.name}, using this answer style: ${character.answerStyle}`),
        contextId,
      }
    );
  } catch (error) {
    throw error;
  }
};
