import mongoose, { Schema } from 'mongoose';
import { IMessage, IConversation } from '../types/index.js';

const messageSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  databaseId: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  previousMessageHash: {
    type: String,
    required: true
  }
});

const conversationSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  databaseId: {
    type: String,
    required: true
  },
  clientAddress: {
    type: String,
    required: true
  },
  artisanAddress: {
    type: String,
    required: true
  },
  lastMessageHash: {
    type: String,
    required: true
  },
  messageCount: {
    type: Number,
    default: 0
  },
  merkleRoot: {
    type: String
  },
  merkleProof: [{
    type: String
  }]
}, {
  timestamps: true
});

export const Message = mongoose.model<IMessage & Document>('Message', messageSchema);
export const Conversation = mongoose.model<IConversation & Document>('Conversation', conversationSchema);