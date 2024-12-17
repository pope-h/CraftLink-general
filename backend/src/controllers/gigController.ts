import { Response, Request, NextFunction } from 'express';
import Gig from '../models/Gig';
import { generateId } from '../utils/idGenerator';
import { createMerkleTree, getProof } from '../utils/merkleTreeUtils';
import { IGig } from '../types';

export const createGig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      clientAddress,
      title,
      clientDescription,
      skillCategory,
      preferredLocation,
      experienceLevel,
      projectDescription,
      contextLink,
      files,
      additionalProjectInfo,
      projectDuration,
      price
    } = req.body;

    // Generate unique gig ID
    const gigId = generateId(clientAddress, title);

    // Create gig object
    const gig = new Gig({
      id: gigId,
      clientAddress,
      clientDescription,
      title,
      skillCategory,
      preferredLocation,
      experienceLevel,
      projectDescription,
      contextLink,
      files,
      additionalProjectInfo,
      projectDuration,
      price
    });

    // Save gig to database
    await gig.save();

    // Create Merkle Tree for all gigs
    const allGigs = await Gig.find();
    const { tree, root } = createMerkleTree(allGigs);

    // Generate and save Merkle proof
    const proof = getProof(gig, tree);
    
    // Update gig with Merkle proof and root
    gig.merkleProof = proof.map(p => p.data.toString('hex'));
    gig.merkleRoot = root;
    await gig.save();

    res.status(201).json({
      gigId,
      merkleProof: gig.merkleProof,
      merkleRoot: gig.merkleRoot
    });
  } catch (error) {
    next(error);
  }
};

export const getGig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gig = await Gig.findOne({ id: req.params.gigId });
    if (!gig) {
      res.status(404).json({ message: 'Gig not found' });
      return;
    }
    res.json(gig);
  } catch (error) {
    next(error);
  }
};