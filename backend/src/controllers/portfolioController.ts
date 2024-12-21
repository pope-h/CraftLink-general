import { Response, Request, NextFunction } from 'express';
import Artisan from '../models/Artisan.ts';
import { ethers } from 'ethers';
import { createMerkleTree, getProof, serializeProof } from '../utils/merkleTreeUtils.ts';
import { IPortfolioItem } from '../types/index.ts';

export const addPortfolioItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { walletAddress } = req.params;
    const portfolioItem = req.body;

    const artisan = await Artisan.findOne({ walletAddress });
    if (!artisan) {
      res.status(404).json({ message: 'Artisan profile not found' });
      return; // Add return statement to exit the function
    }

    // Generate ID for new portfolio item
    const newItem = {
      ...portfolioItem,
      id: ethers.keccak256(
        ethers.solidityPacked(
          ['string', 'string', 'uint256'],
          [artisan.id, portfolioItem.projectTitle, Date.now()]
        )
      )
    };

    // Add to portfolio array
    artisan.portfolio.push(newItem);

    // Update Merkle tree
    const allArtisans = await Artisan.find().lean();
    const { tree, root } = createMerkleTree(allArtisans, 'artisan');
    const proof = getProof(artisan.toObject(), tree, 'artisan');
    const serializedProof = serializeProof(proof);
    artisan.merkleProof = serializedProof.map(p => JSON.stringify(p));
    artisan.merkleRoot = root;
    
    await artisan.save();

    res.status(201).json({
      message: 'Portfolio item added successfully',
      portfolioItem: newItem
    });
  } catch (error) {
    next(error);
  }
};

// Update a specific portfolio item
export const updatePortfolioItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { walletAddress, portfolioId } = req.params;
    const updates = req.body;

    const artisan = await Artisan.findOne({ walletAddress });
    if (!artisan) {
      res.status(404).json({ message: 'Artisan profile not found' });
      return;
    }

    // Find the portfolio item index
    const itemIndex = artisan.portfolio.findIndex(item => item.id === portfolioId);
    if (itemIndex === -1) {
      res.status(404).json({ message: 'Portfolio item not found' });
      return;
    }

    // Update the portfolio item
    artisan.portfolio[itemIndex] = {
      ...artisan.portfolio[itemIndex],
      ...updates,
      id: portfolioId  // Preserve the original ID
    };

    // Update Merkle tree
    const allArtisans = await Artisan.find().lean();
    const { tree, root } = createMerkleTree(allArtisans, 'artisan');
    const proof = getProof(artisan.toObject(), tree, 'artisan');
    const serializedProof = serializeProof(proof);
    artisan.merkleProof = serializedProof.map(p => JSON.stringify(p));
    artisan.merkleRoot = root;

    await artisan.save();

    res.json({
      message: 'Portfolio item updated successfully',
      portfolioItem: artisan.portfolio[itemIndex]
    });
  } catch (error) {
    next(error);
  }
};