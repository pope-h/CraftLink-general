import { Request, Response, NextFunction } from 'express';
import { IGig } from '../types';

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