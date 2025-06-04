import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageModel,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import MessageAvatar from "components/MessageAvatar";
import { sendMessage } from "services";
import { checkmarkIcon, copyIcon, retryIcon } from "utils/constants";
import "./multiplayerChat.scss";
import { SessionState } from "utils/enums";
import { useTimeTravel } from "hooks/useTimeTravel";

type BaseChatMessage = Partial<MessageModel> & {
  systemError?: boolean;
  characterError?: boolean;
};

interface ChatMessage extends BaseChatMessage {
  message: string;
  sentTime: string;
  sender: string;
  direction: "incoming" | "outgoing";
}

const getErrorRate = (messages: ChatMessage[]) => {
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

const MultiplayerChat = ({
  character,
  preselectedQuestion,
  setQuestion,
  onDebuggerOpen,
}) => {
  const { navigationUrl } = useTimeTravel();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [contextId, setContextId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [recordingState, setRecordingState] = useState(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const isDisabled = isTyping || !character;

  useEffect(() => {
    if (messageInputRef.current && !isDisabled) {
      messageInputRef.current.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    setContextId(null);
  }, [character]);

  const postMessage = useCallback(
    async (message: string, isRetry?: boolean) => {
      try {
        const userMessage: ChatMessage = {
          message,
          sentTime: "just now",
          sender: character.name,
          direction: "outgoing",
        };

        setQuestion(message);
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        const response = await sendMessage(
          message,
          contextId,
          character,
          getErrorRate(messages)
        );

        const data = response?.data;

        const botMessage: ChatMessage = {
          message: data?.reply,
          sentTime: "just now",
          sender: "Multiplayer",
          direction: "incoming",
        };

        setTimeout(
          () => {
            setMessages((prev) => [...prev, botMessage]);
            setContextId(data?.contextId);
          },
          isRetry ? 500 : 0
        );
      } catch (err) {
        const botMessage: ChatMessage = {
          message: character.errorMessage,
          sentTime: "just now",
          sender: "Multiplayer",
          direction: "incoming",
          characterError: true,
        };
        const errorMessage: ChatMessage = {
          message: err.message,
          sentTime: "just now",
          sender: "Multiplayer",
          direction: "incoming",
          systemError: true,
        };

        setTimeout(
          () => {
            setMessages((prev) => [...prev, errorMessage, botMessage]);
          },
          isRetry ? 500 : 0
        );
      } finally {
        setTimeout(
          () => {
            setIsTyping(false);
          },
          isRetry ? 500 : 0
        );
      }
    },
    [character, setQuestion, contextId, messages]
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
  }, [character]);

  const onCopy = useCallback(
    (message: string, index: number) => {
      try {
        navigator.clipboard.writeText(message);
        setCopiedIndex(index);
        setTimeout(() => {
          setCopiedIndex(null);
        }, 1000);
      } catch (error) {
        console.error("Couldn't copy, something went wrong!");
      }
    },
    [setCopiedIndex]
  );

  const onRetry = useCallback(
    async (msg: ChatMessage, index) => {
      const prevUserMessage =
        msg.direction === "outgoing"
          ? msg.message
          : msg.systemError || !msg.characterError
          ? messages[index - 1].message
          : messages[index - 2].message;

      if (index === messages.length - 1 && !msg.characterError) {
        setMessages((prev) => prev.slice(0, index - 1));
      }
      await postMessage(prevUserMessage, true);
    },
    [messages, setMessages, postMessage]
  );

  useEffect(() => {
    const handleCopy = (e) => {
      const selection = window.getSelection()?.toString() || "";
      if (selection) {
        e.preventDefault();
        e.clipboardData?.setData("text/plain", selection);
      }
    };

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "MULTIPLAYER_SESSION_DEBUGGER_LIB") {
        const { action, payload } = event.data;
        if (action === "state-change") {
          setRecordingState(payload);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const onSessionOpen = () => {
    if (navigationUrl) {
      window.open(navigationUrl, "_blank");
    }
  };

  return (
    <div className="mtt-chat-container">
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={
              isTyping && (
                <TypingIndicator content={`${character.name} is typing...`} />
              )
            }
          >
            {messages.map((msg, i) => (
              <div className={`mtt-message-row mtt-${msg.direction}`} key={i}>
                <MessageAvatar
                  direction={msg.direction}
                  character={character}
                  systemError={msg.systemError}
                />
                <div className="cs-message__content">
                  <Message.TextContent text={msg.message} />
                  {msg.characterError && (
                    <Message.CustomContent>
                      {recordingState !== SessionState.started ? (
                        <div
                          className="mtt-debugger-toggle"
                          onClick={onDebuggerOpen}
                        >
                          Start Debugging
                        </div>
                      ) : (
                        <div
                          className="mtt-debugger-toggle"
                          onClick={onSessionOpen}
                        >
                          Open Debugger Session
                        </div>
                      )}
                    </Message.CustomContent>
                  )}
                </div>
                <div className="mtt-message-actions">
                  <img
                    src={copiedIndex === i ? checkmarkIcon : copyIcon}
                    alt={copiedIndex === i ? "copied" : "copy message"}
                    title={copiedIndex === i ? "Copied!" : "Copy"}
                    onClick={() => onCopy(msg.message, i)}
                  />
                  <img
                    src={retryIcon}
                    alt="try again"
                    title="Try again"
                    onClick={() => onRetry(msg, i)}
                  />
                </div>
              </div>
            ))}
          </MessageList>

          <MessageInput
            placeholder={
              character
                ? "Type your message here..."
                : "Please select a character to chat"
            }
            className="mtt-message-input-container"
            onSend={(msg) => postMessage(msg)}
            attachButton={false}
            autoFocus={true}
            ref={messageInputRef}
            disabled={isDisabled}
            sendButton={!isTyping}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default memo(MultiplayerChat);
