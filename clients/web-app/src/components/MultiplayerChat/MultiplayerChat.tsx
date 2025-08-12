import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import debuggerInstance from "@multiplayer-app/session-recorder-browser";
import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import MessageAvatar from "components/MessageAvatar";
import SuggestionsList from "components/SuggestionsList";
import { getTimegateEpoch, sendMessage } from "services";
import { checkmarkIcon, copyIcon, retryIcon } from "utils/constants";
import { SessionState, ChatMessage, Character } from "utils/types";
import {
  createUserMessage,
  createCharacterErrorMessage,
  createErrorMessage,
  createBotMessage,
  getErrorRate,
} from "utils/messageHelpers";
import { useTimeTravel } from "hooks/useTimeTravel";
import "./multiplayerChat.scss";

const MultiplayerChat = ({
  character,
  preselectedQuestion,
  setQuestion,
  onDebuggerOpen,
}) => {
  const {
    navigationUrl,
    errorRate,
    setErrorRate,
    isManualRate,
    recordingState,
    setIsManuallyStopped,
  } = useTimeTravel();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [contextId, setContextId] = useState<string>(null);
  const [copiedIndex, setCopiedIndex] = useState<number>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isDisabled = isTyping || !character;

  useEffect(() => {
    if (messageInputRef.current && !isDisabled) {
      messageInputRef.current.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    // Reset chat when character changes
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setContextId(null);
    setMessages([]);
    setIsTyping(false);
  }, [character]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [messages]);

  const onHandleCharacterErrorResponse = useCallback(
    async (errorMessage: string, character: Character, isRetry: boolean) => {
      const delay = isRetry ? 500 : 0;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const prompt = `You are ${character.name}. You've got the following system error: ${errorMessage}. 
        Answer short, respond in first person as if you are that character, using the following answer style for explaining the error message: ${character.errorMessage}.
        After explaining suggest users to use Multiplayer full-stack session recordings to investigate further, 
        starting the debug session and writing more messages`;

        const response = await sendMessage(
          prompt,
          contextId,
          null,
          0,
          controller.signal
        );
        const data = response?.data;

        const botMessage = createCharacterErrorMessage(data?.reply);
        addMessageWithDelay(botMessage, delay);
      } catch (err) {
        const fallbackMessage = createCharacterErrorMessage(
          character.errorMessage
        );
        addMessageWithDelay(fallbackMessage, delay);
        setTimeout(() => setIsTyping(false), delay);
      }
    },
    [contextId]
  );

  const addMessageWithDelay = (message: ChatMessage, delay: number = 0) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, message]);
    }, delay);
  };

  const handleSuccess = (
    reply: string,
    newContextId: string,
    delay: number
  ) => {
    const botMessage = createBotMessage(reply);
    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
      setContextId(newContextId);
    }, delay);
  };

  const handleError = useCallback(
    async (error: any, delay: number, isRetry?: boolean) => {
      const errorMessage = createErrorMessage(error);
      setTimeout(() => {
        setMessages((prev) => [...prev, errorMessage]);
      }, delay);
      await onHandleCharacterErrorResponse(
        error.response?.data?.message || error.message,
        character,
        isRetry
      );
    },
    [onHandleCharacterErrorResponse, character]
  );

  const postMessage = useCallback(
    async (message: string, isRetry?: boolean) => {
      const delay = isRetry ? 500 : 0;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const userMessage = createUserMessage(message, character);
        const _errorRate =
          (isManualRate && errorRate) || getErrorRate(messages);

        setQuestion(message);
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setErrorRate(_errorRate);

        const response = await sendMessage(
          message,
          contextId,
          character,
          _errorRate,
          controller.signal
        );

        getTimegateEpoch();
        const data = response?.data;
        handleSuccess(data?.reply, data?.contextId, delay);
      } catch (err) {
        getTimegateEpoch();
        if (err.code !== AxiosError.ERR_CANCELED) {
          await handleError(err, delay, isRetry);
        }
      } finally {
        setTimeout(() => setIsTyping(false), delay);
      }
    },
    [
      character,
      setQuestion,
      contextId,
      messages,
      handleError,
      errorRate,
      setErrorRate,
      isManualRate,
    ]
  );

  // Handle preselected question
  useEffect(() => {
    if (preselectedQuestion && !messages.length) {
      postMessage(preselectedQuestion);
    }
  }, [preselectedQuestion, messages.length, postMessage]);

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
    async (msg: ChatMessage, index: number) => {
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

  const onSessionStopAndOpen = () => {
    setIsManuallyStopped(true);
    debuggerInstance?.stop();
    if (navigationUrl) {
      window.open(navigationUrl, "_blank");
      localStorage.removeItem("mp-navigation-url");
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
                <div
                  className={`cs-message__content ${
                    msg.systemError ? "cs-system-error" : ""
                  }`}
                >
                  {msg.systemError && (
                    <div className="cs-system-error__placeholder">Error</div>
                  )}
                  <Message.HtmlContent html={msg.message} />
                  {msg.systemError && (
                    <Message.CustomContent>
                      {recordingState !== SessionState.started &&
                      recordingState !== SessionState.paused ? (
                        <div
                          className="mtt-debugger-toggle"
                          onClick={onDebuggerOpen}
                        >
                          👀 👈 Click “Record a new session” and let’s hunt
                          another bug
                        </div>
                      ) : (
                        <div
                          className="mtt-debugger-toggle"
                          onClick={onSessionStopAndOpen}
                        >
                          Stop recording and view your session
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
            <div ref={bottomRef} />
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
      {preselectedQuestion && !isTyping && (
        <SuggestionsList
          character={character}
          onSelect={(msg) => postMessage(msg)}
        />
      )}
    </div>
  );
};

export default memo(MultiplayerChat);
