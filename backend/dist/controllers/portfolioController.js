import Artisan from '../models/Artisan.js';
import { ethers } from 'ethers';
import { createMerkleTree, getProof, serializeProof } from '../utils/merkleTreeUtils.js';
export const addPortfolioItem = async (req, res, next) => {
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
            id: ethers.keccak256(ethers.solidityPacked(['string', 'string', 'uint256'], [artisan.id, portfolioItem.projectTitle, Date.now()]))
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
    }
    catch (error) {
        next(error);
    }
};
// Update a specific portfolio item
export const updatePortfolioItem = async (req, res, next) => {
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
            id: portfolioId // Preserve the original ID
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
    }
    catch (error) {
        next(error);
    }
};
// Delete a specific portfolio item
export const deletePortfolioItem = async (req, res, next) => {
    try {
        const { walletAddress, portfolioId } = req.params;
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
        // Remove the portfolio item
        artisan.portfolio.splice(itemIndex, 1);
        // Update Merkle tree
        const allArtisans = await Artisan.find().lean();
        const { tree, root } = createMerkleTree(allArtisans, 'artisan');
        const proof = getProof(artisan.toObject(), tree, 'artisan');
        const serializedProof = serializeProof(proof);
        artisan.merkleProof = serializedProof.map(p => JSON.stringify(p));
        artisan.merkleRoot = root;
        await artisan.save();
        res.json({
            message: 'Portfolio item deleted successfully',
            remainingItems: artisan.portfolio.length
        });
    }
    catch (error) {
        next(error);
    }
};
// Get all portfolio items for an artisan
export const getPortfolioItems = async (req, res, next) => {
    try {
        const { walletAddress } = req.params;
        const artisan = await Artisan.findOne({ walletAddress })
            .select('portfolio') // Only select the portfolio field
            .lean(); // Convert to plain JavaScript object
        if (!artisan) {
            return res.status(404).json({ message: 'Artisan profile not found' });
        }
        res.json({
            portfolio: artisan.portfolio || [],
            totalItems: (artisan.portfolio || []).length
        });
    }
    catch (error) {
        next(error);
    }
};
// Get a specific portfolio item
export const getPortfolioItem = async (req, res, next) => {
    try {
        const { walletAddress, portfolioId } = req.params;
        const artisan = await Artisan.findOne({ walletAddress })
            .select('portfolio')
            .lean();
        if (!artisan) {
            return res.status(404).json({ message: 'Artisan profile not found' });
        }
        const portfolioItem = artisan.portfolio.find(item => item.id === portfolioId);
        if (!portfolioItem) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }
        res.json({ portfolioItem });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=portfolioController.js.map