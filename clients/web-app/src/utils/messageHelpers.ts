import { Character, ChatMessage } from "utils/types";

export const createUserMessage = (
  message: string,
  character: Character
): ChatMessage => ({
  message,
  sentTime: "just now",
  sender: character.name,
  direction: "outgoing",
});

export const createBotMessage = (reply: string): ChatMessage => ({
  message: reply,
  sentTime: "just now",
  sender: "Multiplayer",
  direction: "incoming",
});

export const createErrorMessage = (error: any): ChatMessage => ({
  message: error.response?.data?.message || error.message,
  sentTime: "just now",
  sender: "System",
  direction: "incoming",
  systemError: true,
});

export const createCharacterErrorMessage = (message: string): ChatMessage => ({
  message,
  sentTime: "just now",
  sender: "Multiplayer",
  direction: "incoming",
  characterError: true,
});

export const getErrorRate = (_messages: ChatMessage[]) => {
  return 0;
};
