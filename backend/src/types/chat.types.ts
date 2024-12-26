export interface IMessage {
  id: string;
  gigId: string;
  senderId: string;
  content: string;
  timestamp: number;
  previousMessageHash: string;
}

export interface IConversation {
  id: string;
  gigId: string;
  clientAddress: string;
  artisanAddress: string;
  lastMessageHash: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
  merkleRoot?: string;
  merkleProof?: string[];
}