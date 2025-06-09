export interface Chat {
  id: number;
  name: string;
  photoUrl: string;
}

export interface Message {
    id: number;
    text: string;
    isFromUser: boolean;
}

export interface ChatWithMessages {
  chat: Chat;
  messages: Message[];
}