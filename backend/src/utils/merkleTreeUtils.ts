import { MerkleTree } from 'merkletreejs';
import SHA256 from 'crypto-js/sha256';
import { IGig } from '../types';

export const createMerkleTree = (data: any[]) => {
  // Convert gig data to leaves
  const leaves = data.map(item => 
    SHA256(JSON.stringify(item))
  );

  // Create Merkle Tree
  const tree = new MerkleTree(leaves, SHA256);
  return {
    tree,
    root: tree.getRoot().toString('hex')
  };
};

export const getProof = (data: any, tree: MerkleTree) => {
  const leaf = Buffer.from(SHA256(JSON.stringify(data)).toString(), 'hex');
  return tree.getProof(leaf);
};

export const verifyMerkleProof = (data: any, proof: any[], root: string) => {
  const leaf = Buffer.from(SHA256(JSON.stringify(data)).toString(), 'hex');
  const tree = new MerkleTree([leaf], SHA256);
  return tree.verify(proof, leaf, root);
};