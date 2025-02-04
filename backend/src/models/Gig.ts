import mongoose, { Schema, Document } from 'mongoose';
import { IGig } from '../types/index.js';

const gigSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  clientAddress: {
    type: String,
    required: true
  },
  clientDescription: {
    type: String
  },
  clientAvatar: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  skillCategory: [{
    type: String,
    required: true
  }],
  preferredLocation: {
    type: String,
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['BEGINNER', 'INTERMEDIATE', 'EXPERT'],
    required: true
  },
  projectDescription: {
    type: String,
    required: true
  },
  contextLink: {
    type: String
  },
  files: [{
    type: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'PDF']
    },
    url: {
      type: String
    }
  }],
  additionalProjectInfo: {
    type: String
  },
  projectDuration: {
    weeks: {
      type: Number,
      required: true
    }
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['CREATED', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED'],
    default: 'CREATED'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  merkleProof: {
    type: [String],
    default: []
  },
  merkleRoot: {
    type: String,
    default: null
  }
});

export default mongoose.model<IGig & Document>('Gig', gigSchema);