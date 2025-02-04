import mongoose, { Schema } from 'mongoose';
import { IArtisan } from '../types/index.js';

const portfolioItemSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  projectDuration: {
    weeks: {
      type: Number,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  files: [{
    type: {
      type: String,
      enum: ['IMAGE', 'VIDEO']
    },
    url: {
      type: String,
      required: true
    }
  }]
});

const artisanSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  artisanCategory: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  experienceLevel: {
    type: String,
    enum: ['BEGINNER', 'INTERMEDIATE', 'EXPERT'],
    required: true
  },
  yearsOfPractice: {
    type: Number,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  preferredLanguages: [{
    type: String
  }],
  serviceTagline: {
    type: String,
    required: true
  },
  portfolio: [portfolioItemSchema],
  minimumProjectAmount: {
    type: Number,
    required: true
  },
  availableForProjects: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  merkleProof: {
    type: [String],
    default: []
  },
  merkleRoot: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<IArtisan & Document>('Artisan', artisanSchema);