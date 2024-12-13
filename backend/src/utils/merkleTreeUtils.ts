import { MerkleTree } from 'merkletreejs';
import SHA256 from 'crypto-js/sha256';
import { IGig } from '../types';

export const createMerkleTree = (gigData: IGig[]) => {
  // Convert gig data to leaves
  const leaves = gigData.map(gig => 
    SHA256(JSON.stringify(gig))
  );

  // Create Merkle Tree
  const tree = new MerkleTree(leaves, SHA256);
  return {
    tree,
    root: tree.getRoot().toString('hex')
  };
};

export const getGigProof = (gig: IGig, tree: MerkleTree) => {
  const leaf = Buffer.from(SHA256(JSON.stringify(gig)).toString(), 'hex');
  return tree.getProof(leaf);
};

export const verifyMerkleProof = (gig: IGig, proof: any[], root: string) => {
  const leaf = Buffer.from(SHA256(JSON.stringify(gig)).toString(), 'hex');
  const tree = new MerkleTree([leaf], SHA256);
  return tree.verify(proof, leaf, root);
};