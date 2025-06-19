// API Client Type Definitions
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
  message: string;
  deliveryType: 'immediate' | 'scheduled';
  deliveryDate?: string;
  isPrivate: boolean;
  passwordHint?: string;
  views: number;
  createdAt: string;
  lastViewedAt?: string;
  canRead?: boolean;
  previewText?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchResponse {
  success: boolean;
  count: number;
  messages: Message[];
}

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database?: {
    status: string;
    name: string;
  };
  port?: number;
}

export interface MessageAPI {
  createMessage(messageData: MessageData): Promise<APIResponse<Message>>;
  searchMessages(senderName: string): Promise<SearchResponse>;
  readMessage(messageId: string, password?: string | null): Promise<APIResponse<Message>>;
  getStats(): Promise<APIResponse<any>>;
  healthCheck(): Promise<HealthResponse>;
}

declare const messageAPI: MessageAPI;
export { messageAPI };
export default messageAPI;
