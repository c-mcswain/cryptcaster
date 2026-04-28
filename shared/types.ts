export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Story {
  id: string;
  title: string;
  source: string;
  content: string;
  isRecorded: boolean;
  createdAt: number;
  kind?: 'story' | 'email' | 'submission';
  mediaUrl?: string;
  metadata?: {
    senderEmail?: string;
    subject?: string;
    ticketId?: string;
    submitterName?: string;
  };
}
export interface ZineContent {
  id: string;
  intro: string;
  announcements: string[];
  featuredStoryId: string | null;
  coverImageUrl: string;
  lastUpdated: number;
  editorName: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}