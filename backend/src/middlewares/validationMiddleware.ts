import { Request, Response, NextFunction } from 'express';
import { IGig, IArtisan } from '../types/index.js';

export const validateGigCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { 
    clientAddress, 
    title, 
    skillCategory, 
    preferredLocation,
    experienceLevel, 
    projectDescription,
    projectDuration,
    price 
  } = req.body as Partial<IGig>;
  
  const errors: string[] = [];

  if (!clientAddress) errors.push('Client address is required');
  if (!title) errors.push('Title is required');
  if (!skillCategory || skillCategory.length === 0) errors.push('Skill category is required');
  if (!preferredLocation) errors.push('Preferred location is required');
  if (!experienceLevel) errors.push('Experience level is required');
  if (!projectDescription) errors.push('Project description is required');
  if (!projectDuration || projectDuration.weeks <= 0) errors.push('Valid project duration is required');
  if (!price || price <= 0) errors.push('Valid price is required');

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

export const validateArtisanCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { 
    walletAddress,
    artisanCategory,
    skills,
    experienceLevel,
    yearsOfPractice,
    bio,
    preferredLanguages,
    serviceTagline,
    minimumProjectAmount
  } = req.body as Partial<IArtisan>;
  
  const errors: string[] = [];

  if (!walletAddress) errors.push('Wallet address is required');
  if (!artisanCategory) errors.push('Artisan category is required');
  if (!skills || skills.length === 0) errors.push('Skills are required');
  if (!experienceLevel) errors.push('Experience level is required');
  if (yearsOfPractice === undefined || yearsOfPractice < 0) errors.push('Valid years of practice is required');
  if (!bio) errors.push('Bio is required');
  if (!preferredLanguages || preferredLanguages.length === 0) errors.push('Preferred languages are required');
  if (!serviceTagline) errors.push('Service tagline is required');
  if (!minimumProjectAmount || minimumProjectAmount <= 0) errors.push('Valid minimum project amount is required');

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

export const validateArtisanUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const updateFields = req.body;
  const errors: string[] = [];

  // Optional validation for specific fields during update
  if (updateFields.skills && updateFields.skills.length === 0) {
    errors.push('Skills cannot be empty');
  }

  if (updateFields.yearsOfPractice !== undefined && updateFields.yearsOfPractice < 0) {
    errors.push('Years of practice must be non-negative');
  }

  if (updateFields.minimumProjectAmount !== undefined && updateFields.minimumProjectAmount <= 0) {
    errors.push('Minimum project amount must be positive');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

export const validatePortfolioItem = (req: Request, res: Response, next: NextFunction): void => {
  const item = req.body;
  const errors: string[] = [];

  if (!item.projectTitle) {
    errors.push('Project title is required');
  }

  if (!item.projectDuration || !item.projectDuration.weeks || item.projectDuration.weeks <= 0) {
    errors.push('Valid project duration is required');
  }

  if (!item.description) {
    errors.push('Description is required');
  }

  if (item.files) {
    item.files.forEach((file: any, index: number) => {
      if (!file.type || !['IMAGE', 'VIDEO'].includes(file.type)) {
        errors.push(`Invalid file type for file ${index + 1}`);
      }
      if (!file.url) {
        errors.push(`File URL is required for file ${index + 1}`);
      }
    });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

export const validateMessage = (req: Request, res: Response, next: NextFunction): void => {
  const { content } = req.body;
  const errors: string[] = [];

  if (!content?.trim()) {
    errors.push('Message content is required');
  }

  if (content && content.length > 2000) {
    errors.push('Message content exceeds maximum length (2000 characters)');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};