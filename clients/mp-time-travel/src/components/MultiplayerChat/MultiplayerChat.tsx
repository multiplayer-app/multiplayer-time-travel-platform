import { useCallback, useEffect, useState, memo, useRef } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MessageModel } from '@chatscope/chat-ui-kit-react';
import MessageAvatar from 'components/MessageAvatar';
import { sendMessage } from 'services';
import { generalErrors } from 'mock/generalErrors';
import './multiplayerChat.scss';

type BaseChatMessage = Partial<MessageModel> & {
  systemError?: boolean;
  characterError?: boolean;
};

interface ChatMessage extends BaseChatMessage {
  message: string;
  sentTime: string;
  sender: string;
  direction: 'incoming' | 'outgoing';
}

const getRandomErrorMessage = () => {
  const randomIndex = Math.floor(Math.random() * generalErrors.length);
  return generalErrors[randomIndex];
};

const MultiplayerChat = ({ character, preselectedQuestion, setQuestion, onDebuggerOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [contextId, setContextId] = useState(null);
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
    async (message: string) => {
      try {
        const userMessage: ChatMessage = {
          message,
          sentTime: 'just now',
          sender: character.name,
          direction: 'outgoing'
        };

        setQuestion(message);
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        const response = await sendMessage(message, contextId, character);

        const data = response?.data;

        const botMessage: ChatMessage = {
          message: data?.reply,
          sentTime: 'just now',
          sender: 'Multiplayer',
          direction: 'incoming'
        };

        setMessages((prev) => [...prev, botMessage]);
        setContextId(data?.contextId);
      } catch (err) {
        const botMessage: ChatMessage = {
          message: '',
          sentTime: 'just now',
          sender: 'Multiplayer',
          direction: 'incoming'
        };
        if (err.statusCode !== 500) {
          botMessage.message = getRandomErrorMessage();
          botMessage.systemError = true;
        } else {
          botMessage.message = character.errorMessage;
          botMessage.characterError = true;
        }

        setMessages((prev) => [...prev, botMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [character, setQuestion, contextId]
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

  return (
    <div className='mtt-chat-container'>
      <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={isTyping && <TypingIndicator content={`${character.name} is typing...`} />}>
            {messages.map((msg, i) => (
              <div className={`mtt-message-row mtt-${msg.direction}`} key={i}>
                <MessageAvatar direction={msg.direction} character={character} systemError={msg.systemError} />
                <div className='cs-message__content'>
                  <Message.HtmlContent html={msg.message} />
                  {(msg.systemError || msg.characterError) && (
                    <Message.CustomContent>
                      <div className='mtt-debugger-toggle' onClick={onDebuggerOpen}>
                        Start Debugging
                      </div>
                    </Message.CustomContent>
                  )}
                </div>
              </div>
            ))}
          </MessageList>

          <MessageInput
            placeholder={character ? 'Type your message here...' : 'Please select a character to chat'}
            className='mtt-message-input-container'
            onSend={postMessage}
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
