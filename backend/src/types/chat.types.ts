export interface IMessage {
  id: string;
  databaseId: string;
  senderId: string;
  content: string;
  timestamp: number;
  previousMessageHash: string;
}

export interface IConversation {
  id: string;
  databaseId: string;
  clientAddress: string;
  artisanAddress: string;
  lastMessageHash: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
  merkleRoot?: string;
  merkleProof?: string[];
}