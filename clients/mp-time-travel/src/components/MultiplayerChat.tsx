import React, { useCallback, useEffect, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MessageModel } from "@chatscope/chat-ui-kit-react/src/components/Message/Message";

const MultiplayerChat = ({ character, preselectedQuestion, setQuestion }) => {
  const [messages, setMessages] = useState<Partial<MessageModel>[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const postMessage = async (message) => {
    try {
      const res = await fetch("http://localhost:8080/v1/dialogue-hub/docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // setResponse(data);
      debugger;
    } catch (err) {
      // setError(err.message);
      debugger;
    }
  };

  const handleSend = useCallback(
    (message) => {
      const newMessage: Partial<MessageModel> = {
        message,
        sentTime: "just now",
        sender: "user",
        direction: "outgoing",
      };
      setQuestion(message);
      setMessages([...messages, newMessage]);
      setIsTyping(true);

      // Simulate response after a delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            message: "This would be the system's response",
            sentTime: "just now",
            sender: "Multiplayer",
            direction: "incoming",
          },
        ]);
        setIsTyping(false);
      }, 2000);
    },
    [messages, setQuestion]
  );

  useEffect(() => {
    if (preselectedQuestion && !messages.length) {
      handleSend(preselectedQuestion);
    }
  }, [preselectedQuestion, messages, handleSend]);

  useEffect(() => {
    setMessages([]);
    setIsTyping(false);
    // cancel the AI request here
  }, [character]);

  return (
    <div className="mtt-chat-container">
      <MainContainer>
        <ChatContainer>
          {messages.length && (
            <MessageList
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Multiplayer is typing" />
                ) : null
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
          )}
          <MessageInput
            placeholder={
              character
                ? "Enter your message here..."
                : "Choose character to chat with..."
            }
            onSend={postMessage}
            attachButton={false}
            disabled={isTyping || !character}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

const MessageAvatar = ({ direction, character }) =>
  direction === "incoming" ? (
    character ? (
      <img
        src={character?.avatar}
        alt={character?.description}
        className="mtt-message-avatar mtt-incoming"
      />
    ) : (
      <div className="mtt-message-avatar mtt-incoming-empty" />
    )
  ) : (
    <div className="mtt-message-avatar mtt-outgoing" />
  );

export default MultiplayerChat;
