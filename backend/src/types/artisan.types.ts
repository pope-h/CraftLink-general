import { Request } from "express";

export interface IPortfolioItem {
  id: string;
  projectTitle: string;
  projectDuration: {
    weeks: number;
  };
  description: string;
  files: {
    type: 'IMAGE' | 'VIDEO';
    url: string;
  }[];
}

export interface IArtisan {
  id: string;
  walletAddress: string;
  artisanCategory: string;
  skills: string[];
  experienceLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  yearsOfPractice: number;
  bio: string;
  preferredLanguages: string[];
  serviceTagline: string;
  portfolio: IPortfolioItem[];
  minimumProjectAmount: number;
  availableForProjects: boolean;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
  merkleProof?: string[];
  merkleRoot?: string;
}

export interface ArtisanCreationRequest extends Request {
  body: Omit<IArtisan, 
    'id' | 
    'status' | 
    'createdAt' | 
    'updatedAt' | 
    'merkleProof' | 
    'merkleRoot'
  >;
}

export interface ArtisanUpdateRequest extends Request {
  body: Partial<Omit<IArtisan, 
    'id' | 
    'status' | 
    'createdAt' | 
    'updatedAt' | 
    'merkleProof' | 
    'merkleRoot'
  >>;
}