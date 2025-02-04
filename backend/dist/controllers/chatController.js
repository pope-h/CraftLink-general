import { ethers } from 'ethers';
import { Message, Conversation } from '../models/Chat.js';
import { createMessageHash, createConversationTree } from '../utils/chatMerkleTree.js';
import Gig from '../models/Gig.js';
export const initializeConversation = async (req, res, next) => {
    try {
        const { databaseId } = req.params;
        const { artisanAddress } = req.body;
        const clientAddress = req.body.walletAddress; // From auth middleware
        // Verify gig exists and participants
        const gig = await Gig.findOne({ id: databaseId });
        if (!gig) {
            res.status(404).json({ message: 'Gig not found' });
            return;
        }
        // Verify participant roles
        if (gig.clientAddress !== clientAddress) {
            res.status(403).json({ message: 'Only gig creator can initialize conversation' });
            return;
        }
        // Generate conversation ID
        const conversationId = ethers.keccak256(ethers.solidityPacked(['string', 'address', 'address'], [databaseId, clientAddress, artisanAddress]));
        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({ id: conversationId });
        if (existingConversation) {
            res.status(400).json({ message: 'Conversation already exists' });
            return;
        }
        // Create new conversation
        const conversation = new Conversation({
            id: conversationId,
            databaseId,
            clientAddress,
            artisanAddress,
            lastMessageHash: ethers.keccak256(ethers.toUtf8Bytes('CONVERSATION_START')),
            messageCount: 0
        });
        await conversation.save();
        res.status(201).json({
            conversationId,
            conversation
        });
    }
    catch (error) {
        next(error);
    }
};
export const sendMessage = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        const senderAddress = req.body.walletAddress; // From auth middleware
        // Find conversation
        const conversation = await Conversation.findOne({ id: conversationId });
        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }
        // Verify sender is participant
        if (senderAddress !== conversation.clientAddress && senderAddress !== conversation.artisanAddress) {
            res.status(403).json({ message: 'Only conversation participants can send messages' });
            return;
        }
        // Create new message
        const message = new Message({
            id: ethers.keccak256(ethers.solidityPacked(['string', 'uint256'], [conversationId, conversation.messageCount])),
            databaseId: conversation.databaseId,
            senderId: senderAddress,
            content,
            timestamp: Date.now(),
            previousMessageHash: conversation.lastMessageHash
        });
        // Update conversation
        conversation.lastMessageHash = createMessageHash(message);
        conversation.messageCount += 1;
        // Get all messages and update merkle tree
        const messages = await Message.find({ databaseId: conversation.databaseId }).sort('timestamp');
        const { root, tree } = createConversationTree([...messages, message]);
        conversation.merkleRoot = root;
        conversation.merkleProof = tree.getProof(Buffer.from(createMessageHash(message), 'hex'))
            .map((p) => JSON.stringify(p));
        // Save everything
        await Promise.all([
            message.save(),
            conversation.save()
        ]);
        res.status(201).json({
            message,
            merkleRoot: root,
            merkleProof: conversation.merkleProof
        });
    }
    catch (error) {
        next(error);
    }
};
export const getConversationMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const requesterAddress = req.body.walletAddress; // From auth middleware
        // Find conversation
        const conversation = await Conversation.findOne({ id: conversationId });
        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }
        // Verify requester is participant
        if (requesterAddress !== conversation.clientAddress && requesterAddress !== conversation.artisanAddress) {
            res.status(403).json({ message: 'Only conversation participants can view messages' });
            return;
        }
        // Paginate messages
        const skip = (Number(page) - 1) * Number(limit);
        const messages = await Message.find({ databaseId: conversation.databaseId })
            .sort('-timestamp')
            .skip(skip)
            .limit(Number(limit));
        // Verify message chain
        let isValid = true;
        for (let i = 1; i < messages.length; i++) {
            const currentHash = createMessageHash(messages[i]);
            if (messages[i].previousMessageHash !== currentHash) {
                isValid = false;
                break;
            }
        }
        res.json({
            conversation,
            messages,
            isValid,
            merkleRoot: conversation.merkleRoot,
            page: Number(page),
            totalMessages: conversation.messageCount
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=chatController.js.map