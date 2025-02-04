import Artisan from '../models/Artisan.js';
import { generateId } from '../utils/idGenerator.js';
import { createMerkleTree, deserializeProof, getProof, serializeProof, verifyMerkleProof } from '../utils/merkleTreeUtils.js';
import { ethers } from 'ethers';
export const createArtisanProfile = async (req, res, next) => {
    try {
        const { walletAddress, artisanCategory, skills, experienceLevel, yearsOfPractice, bio, preferredLanguages, serviceTagline, portfolio, minimumProjectAmount, availableForProjects, avatar } = req.body;
        // Generate unique artisan ID
        const artisanId = generateId(walletAddress, artisanCategory, serviceTagline);
        // Add unique IDs to portfolio items
        const portfolioWithIds = portfolio ? portfolio.map((item) => ({
            ...item,
            id: ethers.keccak256(ethers.solidityPacked(['string', 'string', 'uint256'], [artisanId, item.projectTitle, Date.now()]))
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
        // Create Merkle Tree for all artisans with type specification
        const allArtisans = await Artisan.find().lean();
        const { tree, root } = createMerkleTree(allArtisans, 'artisan');
        // Generate Merkle proof with type
        const proof = getProof(artisan.toObject(), tree, 'artisan');
        // Serialize proof for storage
        const serializedProof = serializeProof(proof);
        artisan.merkleProof = serializedProof.map(p => JSON.stringify(p));
        artisan.merkleRoot = root;
        await artisan.save();
        res.status(201).json({
            artisanId,
            merkleProof: artisan.merkleProof,
            merkleRoot: root
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateArtisanProfile = async (req, res, next) => {
    try {
        const { walletAddress } = req.params;
        const updateData = req.body;
        // Find existing artisan
        const artisan = await Artisan.findOne({ walletAddress: walletAddress });
        if (!artisan) {
            res.status(404).json({ message: 'Artisan profile not found' });
            return;
        }
        // Remove portfolio from updateData if present since it has its own endpoints now
        if (updateData.portfolio) {
            delete updateData.portfolio;
        }
        // Update artisan profile
        Object.assign(artisan, updateData);
        // Update Merkle Tree
        const allArtisans = await Artisan.find().lean();
        const { tree, root } = createMerkleTree(allArtisans, 'artisan');
        const proof = getProof(artisan.toObject(), tree, 'artisan');
        const serializedProof = serializeProof(proof);
        artisan.merkleProof = serializedProof.map(p => JSON.stringify(p));
        artisan.merkleRoot = root;
        await artisan.save();
        res.json({
            message: 'Artisan profile updated successfully',
            artisan: {
                ...artisan.toObject(),
                merkleProof: artisan.merkleProof,
                merkleRoot: artisan.merkleRoot
            }
        });
    }
    catch (error) {
        next(error);
    }
};
export const getArtisanProfile = async (req, res, next) => {
    try {
        const { walletAddress } = req.params;
        const artisan = await Artisan.findOne({ walletAddress: walletAddress });
        if (!artisan) {
            res.status(404).json({ message: 'Artisan profile not found' });
            return;
        }
        // Deserialize and verify the merkle proof
        const proof = deserializeProof(artisan.merkleProof || []);
        const isValid = verifyMerkleProof(artisan.toObject(), proof, artisan.merkleRoot || '', 'artisan');
        if (!isValid) {
            res.status(400).json({
                message: 'Invalid merkle proof. Data may have been tampered with.',
                artisan
            });
            return;
        }
        res.json({
            verified: true,
            artisan
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=artisanController.js.map