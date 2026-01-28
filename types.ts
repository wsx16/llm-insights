
export interface TokenInfo {
  text: string;
  color: string;
  id: number;
}

export interface ExplanationResponse {
  definition: string;
  analogy: string;
  importance: string;
}

export enum TabType {
  OVERVIEW = 'overview',
  TOKENIZER = 'tokenizer',
  CONTEXT = 'context',
  AI_CHAT = 'ai_chat'
}
