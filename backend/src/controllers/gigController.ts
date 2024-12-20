import { Response, Request, NextFunction } from 'express';
import Gig from '../models/Gig.ts';
import { generateId } from '../utils/idGenerator.ts';
import { createMerkleTree, getProof, serializeProof } from '../utils/merkleTreeUtils.ts';
import { IGig } from '../types/index.ts';

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
    const gigId = generateId(clientAddress, title, projectDescription);

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

    // Create Merkle Tree for all gigs with type specification
    const allGigs = await Gig.find().lean();
    console.log("All Gigs", allGigs);
    const { tree, root } = createMerkleTree(allGigs, 'gig');

    // Generate Merkle proof with type
    const proof = getProof(gig.toObject(), tree, 'gig');
    
    // Serialize proof for storage
    const serializedProof = serializeProof(proof);
    gig.merkleProof = serializedProof.map(p => JSON.stringify(p));
    gig.merkleRoot = root;
    await gig.save();

    res.status(201).json({
      gigId,
      merkleProof: gig.merkleProof,
      merkleRoot: root
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