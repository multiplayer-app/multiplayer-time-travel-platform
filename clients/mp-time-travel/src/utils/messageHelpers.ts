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

  const cycleLength = 7; // 3 safe + 4 increasing
  const cycleIndex = outgoingCount % cycleLength;

  if (cycleIndex < 3) {
    return 0;
  }

  return (cycleIndex - 2) * 0.25; // 0.25, 0.5, 0.75, 1.0
};
