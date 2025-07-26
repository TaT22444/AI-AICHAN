export interface AIPartner {
  id: string;
  name: string;
  character: string;
  avatar: string;
  personality: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface LearningSession {
  id: string;
  task: string;
  aiPartner: AIPartner;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  summary?: string;
  selectedFeelings: string[];
}

export interface Feeling {
  id: string;
  text: string;
  emoji: string;
}

export interface Report {
  task: string;
  aiSummary: string;
  selectedFeelings: string[];
  sessionDuration: number;
  messageCount: number;
} 