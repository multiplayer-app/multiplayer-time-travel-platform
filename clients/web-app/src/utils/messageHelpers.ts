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

export const getErrorRate = (messages: ChatMessage[]) => {
  const outgoingMessages = messages.filter(
    (msg) => msg.direction === "outgoing"
  );
  const outgoingCount = outgoingMessages.length;

  const cycleLength = 4; // 2 safe + 2 increasing
  const cycleIndex = outgoingCount % cycleLength;

  if (cycleIndex < 2) {
    return 0;
  }

  return (cycleIndex - 1) * 0.5; // 0.5, 1
};
