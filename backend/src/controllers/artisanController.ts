import { Response, Request, NextFunction } from 'express';
import Artisan from '../models/Artisan';
import { generateId } from '../utils/idGenerator';
import { createMerkleTree, getProof } from '../utils/merkleTreeUtils';
import { IArtisan, IPortfolioItem } from '../types';
import { ethers } from 'ethers';

export const createArtisanProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      walletAddress,
      artisanCategory,
      skills,
      experienceLevel,
      yearsOfPractice,
      bio,
      preferredLanguages,
      serviceTagline,
      portfolio,
      minimumProjectAmount,
      availableForProjects,
      avatar
    } = req.body;

    // Generate unique artisan ID
    const artisanId = generateId(walletAddress, serviceTagline);

    // Add unique IDs to portfolio items
    const portfolioWithIds = portfolio ? portfolio.map((item: IPortfolioItem) => ({
      ...item,
      id: ethers.keccak256(
        ethers.solidityPacked(
          ['string', 'string', 'uint256'], 
          [artisanId, item.projectTitle, Date.now()]
        )
      )
    })) : [];

    // Create artisan object
    const artisan = new Artisan({
      id: artisanId,
      walletAddress,
      artisanCategory,
      skills,
      experienceLevel,
      yearsOfPractice,
      bio,
      preferredLanguages,
      serviceTagline,
      portfolio: portfolioWithIds,
      minimumProjectAmount,
      availableForProjects,
      avatar
    });

    // Save artisan to database
    await artisan.save();

    // Create Merkle Tree for all artisans
    const allArtisans = await Artisan.find();
    const { tree, root } = createMerkleTree(allArtisans);

    // Generate and save Merkle proof
    const proof = getProof(artisan, tree);
    
    // Update artisan with Merkle proof and root
    artisan.merkleProof = proof.map(p => p.data.toString('hex'));
    artisan.merkleRoot = root;
    await artisan.save();

    res.status(201).json({
      artisanId,
      merkleProof: artisan.merkleProof,
      merkleRoot: artisan.merkleRoot
    });
  } catch (error) {
    next(error);
  }
};

export const updateArtisanProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { artisanId } = req.params;
    const updateData = req.body;

    // Find existing artisan
    const artisan = await Artisan.findOne({ id: artisanId });
    if (!artisan) {
      res.status(404).json({ message: 'Artisan profile not found' });
      return;
    }

    // Handle portfolio updates
    if (updateData.portfolio) {
      // Add unique IDs to new portfolio items
      updateData.portfolio = updateData.portfolio.map((item: IPortfolioItem) => {
        if (!item.id) {
          return {
            ...item,
            id: ethers.keccak256(
              ethers.solidityPacked(
                ['string', 'string', 'uint256'], 
                [artisan.id, item.projectTitle, Date.now()]
              )
            )
          };
        }
        return item;
      });
    }

    // Update artisan profile
    Object.assign(artisan, updateData);

    // Regenerate Merkle Tree
    const allArtisans = await Artisan.find();
    const { tree, root } = createMerkleTree(allArtisans);

    // Generate and save Merkle proof
    const proof = getProof(artisan, tree);
    
    // Update artisan with Merkle proof and root
    artisan.merkleProof = proof.map(p => p.data.toString('hex'));
    artisan.merkleRoot = root;

    // Save updated profile
    await artisan.save();

    res.json({
      message: 'Artisan profile updated successfully',
      artisan: {
        ...artisan.toObject(),
        merkleProof: artisan.merkleProof,
        merkleRoot: artisan.merkleRoot
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getArtisanProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { artisanId } = req.params;
    const artisan = await Artisan.findOne({ id: artisanId });

    if (!artisan) {
      res.status(404).json({ message: 'Artisan profile not found' });
      return;
    }

    res.json(artisan);
  } catch (error) {
    next(error);
  }
};