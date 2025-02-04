import { MerkleTree } from 'merkletreejs';
import pkg from 'crypto-js';
import { ethers } from 'ethers';
const { SHA256 } = pkg;
export const createMessageHash = (message) => {
    return ethers.keccak256(ethers.solidityPacked(['string', 'string', 'string', 'uint256', 'string'], [
        message.databaseId,
        message.senderId,
        message.content,
        message.timestamp,
        message.previousMessageHash
    ]));
};
export const createConversationTree = (messages) => {
    const leaves = messages.map(msg => Buffer.from(createMessageHash(msg), 'hex'));
    const tree = new MerkleTree(leaves, SHA256);
    return {
        tree,
        root: tree.getRoot().toString('hex')
    };
};
export const verifyMessage = (message, proof, root) => {
    const leaf = Buffer.from(createMessageHash(message), 'hex');
    const tree = new MerkleTree([leaf], SHA256);
    return tree.verify(proof, leaf, root);
};
//# sourceMappingURL=chatMerkleTree.js.map