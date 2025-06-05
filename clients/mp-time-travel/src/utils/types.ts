import { MessageModel } from "@chatscope/chat-ui-kit-react";

export enum SessionState {
  started = "2",
  paused = "1",
  stopped = "0",
}

type BaseChatMessage = Partial<MessageModel> & {
  systemError?: boolean;
  characterError?: boolean;
};

export interface ChatMessage extends BaseChatMessage {
  message: string;
  sentTime: string;
  sender: string;
  direction: "incoming" | "outgoing";
}

export interface Character {
  id: number;
  name: string;
  startDate: {
    isBCE: boolean;
    date: string;
    bceString: string | null;
  };
  endDate: {
    isBCE: boolean;
    date: string;
    bceString: string | null;
  };
  questions: string[];
  avatar: string;
  panelImg: string;
  pronoun: string;
  description: string;
  errorMessage: string;
  answerStyle: string;
}
