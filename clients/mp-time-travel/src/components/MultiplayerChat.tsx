import React, { useCallback, useEffect, useState, memo } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MessageModel } from "@chatscope/chat-ui-kit-react";
import MessageAvatar from "./MessageAvatar";

interface ChatMessage extends Partial<MessageModel> {
  message: string;
  sentTime: string;
  sender: string;
  direction: "incoming" | "outgoing";
}

const MultiplayerChat = ({ character, preselectedQuestion, setQuestion }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postMessage = useCallback(
    async (message: string) => {
      try {
        // Create user message
        const userMessage: ChatMessage = {
          message,
          sentTime: "just now",
          sender: character.name,
          direction: "outgoing",
        };

        setQuestion(message);
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setError(null);

        // API call
        const response = await fetch(
          "http://localhost:8080/v1/dialogue-hub/docs",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        debugger;

        // Create bot response
        const botMessage: ChatMessage = {
          message: data.response || "I couldn't process that request.",
          sentTime: "just now",
          sender: "Multiplayer",
          direction: "incoming",
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("API Error:", err);
      } finally {
        setIsTyping(false);
      }
    },
    [character, setQuestion]
  );

  // Handle preselected question
  useEffect(() => {
    if (preselectedQuestion && !messages.length) {
      postMessage(preselectedQuestion);
    }
  }, [preselectedQuestion, messages.length, postMessage]);

  // Reset chat when character changes
  useEffect(() => {
    setMessages([]);
    setIsTyping(false);
    setError(null);
  }, [character]);

  return (
    <div className="mtt-chat-container">
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={
              isTyping && <TypingIndicator content="Multiplayer is typing..." />
            }
          >
            {messages.map((msg, i) => (
              <div className={`mtt-message-row mtt-${msg.direction}`} key={i}>
                <MessageAvatar
                  direction={msg.direction}
                  character={character}
                />
                <Message
                  key={i}
                  model={{
                    message: msg.message,
                    sentTime: msg.sentTime,
                    sender: msg.sender,
                    direction: "incoming",
                    position: "normal",
                  }}
                />
              </div>
            ))}
          </MessageList>

          <MessageInput
            placeholder={
              character
                ? "Type your message here..."
                : "Please select a character to chat"
            }
            onSend={postMessage}
            attachButton={false}
            disabled={isTyping || !character}
            sendButton={!isTyping}
          />

          {error && <div className="mtt-chat-error">{error}</div>}
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default memo(MultiplayerChat);
