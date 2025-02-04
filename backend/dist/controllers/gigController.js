import Gig from '../models/Gig.js';
import { generateId } from '../utils/idGenerator.js';
import { createMerkleTree, deserializeProof, getProof, serializeProof, verifyMerkleProof } from '../utils/merkleTreeUtils.js';
export const createGig = async (req, res, next) => {
    try {
        const { clientAddress, title, clientDescription, skillCategory, preferredLocation, experienceLevel, projectDescription, contextLink, files, additionalProjectInfo, projectDuration, price } = req.body;
        // Generate unique gig ID
        const databaseId = generateId(clientAddress, title, projectDescription);
        // Create gig object
        const gig = new Gig({
            id: databaseId,
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
        // console.log("All Gigs", allGigs);
        const { tree, root } = createMerkleTree(allGigs, 'gig');
        // Generate Merkle proof with type
        const proof = getProof(gig.toObject(), tree, 'gig');
        // Serialize proof for storage
        const serializedProof = serializeProof(proof);
        gig.merkleProof = serializedProof.map(p => JSON.stringify(p));
        gig.merkleRoot = root;
        await gig.save();
        res.status(201).json({
            databaseId,
            merkleProof: gig.merkleProof,
            merkleRoot: root
        });
    }
    catch (error) {
        next(error);
    }
};
export const getGig = async (req, res, next) => {
    try {
        const { merkleRoot } = req.query; // Get root from blockchain
        const gig = await Gig.findOne({ id: req.params.databaseId });
        if (!gig) {
            res.status(404).json({ message: 'Gig not found' });
            return;
        }
        // Deserialize and verify the merkle proof
        const proof = deserializeProof(gig.merkleProof || []);
        const isValid = verifyMerkleProof(gig.toObject(), proof, gig.merkleRoot ?? '', 'gig');
        if (!isValid) {
            res.status(400).json({
                message: 'Invalid merkle proof. Data may have been tampered with.',
                gig
            });
            return;
        }
        res.json({
            verified: true,
            gig
        });
    }
    catch (error) {
        next(error);
    }
};
// export const getAllGigs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const gigs = await Gig.find();
//     res.json(gigs);
//   } catch (error) {
//     next(error);
//   }
// };
export const getAllGigs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, experienceLevel, skillCategory } = req.query;
        // Build query
        const query = {};
        if (status)
            query.status = status;
        if (experienceLevel)
            query.experienceLevel = experienceLevel;
        if (skillCategory)
            query.skillCategory = { $in: [skillCategory] };
        // Convert page and limit to numbers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const gigs = await Gig.find(query)
            .sort({ createdAt: -1 }) // Most recent first
            .skip(skip)
            .limit(limitNum);
        // Get total count for pagination
        const total = await Gig.countDocuments(query);
        res.json({
            gigs,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalGigs: total
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=gigController.js.map