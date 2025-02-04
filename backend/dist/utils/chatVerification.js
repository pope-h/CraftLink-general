// import { ethers } from 'ethers';
// import { ChatSystem } from '../contracts/ChatSystem';
// import { createConversationTree } from './chatMerkleTree.ts';
export {};
// export const updateConversationOnChain = async (
//   chatContract: ChatSystem,
//   conversationId: string,
//   messages: any[]
// ) => {
//   try {
//     // Generate new merkle tree
//     const { root, tree } = createConversationTree(messages);
//     // Get gig ID from conversation
//     const conversation = await Conversation.findOne({ id: conversationId });
//     if (!conversation) throw new Error('Conversation not found');
//     // Update root on chain
//     const tx = await chatContract.updateConversationRoot(
//       conversation.gigId,
//       root,
//       messages.length
//     );
//     await tx.wait();
//     // Update conversation in database
//     conversation.merkleRoot = root;
//     await conversation.save();
//     return {
//       merkleRoot: root,
//       transactionHash: tx.hash
//     };
//   } catch (error) {
//     console.error('Failed to update conversation on chain:', error);
//     throw error;
//   }
// };
// export const verifyConversationIntegrity = async (
//   chatContract: ChatSystem,
//   conversationId: string,
//   messages: any[]
// ) => {
//   try {
//     // Get conversation
//     const conversation = await Conversation.findOne({ id: conversationId });
//     if (!conversation) throw new Error('Conversation not found');
//     // Get on-chain root
//     const { root, messageCount } = await chatContract.getConversationRoot(conversation.gigId);
//     // Verify message count
//     if (messageCount !== messages.length) {
//       return {
//         isValid: false,
//         error: 'Message count mismatch'
//       };
//     }
//     // Generate merkle tree and verify root matches
//     const { root: calculatedRoot } = createConversationTree(messages);
//     return {
//       isValid: root === calculatedRoot,
//       onChainRoot: root,
//       calculatedRoot
//     };
//   } catch (error) {
//     console.error('Failed to verify conversation:', error);
//     throw error;
//   }
// };
//# sourceMappingURL=chatVerification.js.map