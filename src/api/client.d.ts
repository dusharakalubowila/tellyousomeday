// Type definitions for TellYouSomeday API

export interface MessageData {
  senderName: string;
  recipientType: 'person' | 'family' | 'world';
  recipientName?: string;
  message: string;
  deliveryType: 'immediate' | 'scheduled';
  deliveryDate?: string;
  isPrivate: boolean;
  passwordHint?: string;
  password?: string;
}

export interface Message {
  id: string;
  senderName: string;
  recipientType: 'person' | 'family' | 'world';
  recipientName?: string;
  message?: string;
  previewText?: string;
  deliveryType: 'immediate' | 'scheduled';
  deliveryDate?: string;
  isPrivate: boolean;
  passwordHint?: string;
  views: number;
  createdAt: string;
  lastViewedAt?: string;
  canRead?: boolean;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface SearchResponse extends APIResponse {
  count: number;
  messages: Message[];
}

export interface MessageResponse extends APIResponse {
  message: Message;
}

export interface StatsResponse extends APIResponse {
  stats: {
    totalMessages: number;
    privateMessages: number;
    scheduledMessages: number;
    deliveredMessages: number;
    totalViews: number;
  };
  recipientTypeStats: Array<{
    _id: string;
    count: number;
  }>;
}

export interface MessageAPI {
  createMessage(messageData: MessageData): Promise<APIResponse>;
  searchMessages(senderName: string): Promise<SearchResponse>;
  readMessage(messageId: string, password?: string | null): Promise<MessageResponse>;
  getStats(): Promise<StatsResponse>;
  healthCheck(): Promise<APIResponse>;
}

declare const messageAPI: MessageAPI;
export { messageAPI };
export default messageAPI;
