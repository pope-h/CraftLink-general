import { MerkleTree } from 'merkletreejs';
import pkg from 'crypto-js';
import { IGig, IArtisan } from '../types/index.js';

const { SHA256 } = pkg;

type EntityType = 'gig' | 'artisan';

// Helper function to normalize gig data
const normalizeGig = (gig: IGig) => ({
  id: gig.id,
  clientAddress: gig.clientAddress,
  title: gig.title,
  projectDescription: gig.projectDescription,
  price: gig.price,
  skillCategory: gig.skillCategory,
  experienceLevel: gig.experienceLevel
});

// Helper function to normalize artisan data
const normalizeArtisan = (artisan: IArtisan) => ({
  id: artisan.id,
  walletAddress: artisan.walletAddress,
  artisanCategory: artisan.artisanCategory,
  skills: artisan.skills,
  experienceLevel: artisan.experienceLevel,
  minimumProjectAmount: artisan.minimumProjectAmount
});

// Generic normalize function
const normalizeData = (data: any, type: EntityType) => {
  const normalizer = {
    gig: normalizeGig,
    artisan: normalizeArtisan
  };

  const normalized = normalizer[type](data);

  // Sort keys to ensure consistent ordering
  return Object.keys(normalized)
    .sort()
    .reduce((obj: any, key: string) => {
      obj[key] = normalized[key as keyof typeof normalized];
      return obj;
    }, {});
};

// Hash function that takes into account the entity type
const hashData = (data: any, type: EntityType) => {
  const normalized = normalizeData(data, type);
  return SHA256(JSON.stringify(normalized)).toString();
};

export const createMerkleTree = (data: any[], type: EntityType) => {
  // Convert data to leaves using the type-aware hash function
  const leaves = data.map(item => Buffer.from(hashData(item, type), 'hex'));
  
  // Create Merkle Tree
  const tree = new MerkleTree(leaves, SHA256);
  return {
    tree,
    root: tree.getRoot().toString('hex')
  };
};

export const getProof = (data: any, tree: MerkleTree, type: EntityType) => {
  // Use the type-aware hash function for generating the leaf
  const leaf = Buffer.from(hashData(data, type), 'hex');
  return tree.getProof(leaf);
};

export const verifyMerkleProof = (data: any, proof: any[], root: string, type: EntityType) => {
  const leaf = Buffer.from(hashData(data, type), 'hex');
  const tree = new MerkleTree([leaf], SHA256);
  return tree.verify(proof, leaf, root);
};

// Helper to serialize proof for storage
export const serializeProof = (proof: any[]) => {
  return proof.map(p => ({
    position: p.position,
    data: p.data.toString('hex')
  }));
};

// Helper to deserialize stored proof
export const deserializeProof = (serializedProof: string[]) => {
  return serializedProof.map(p => {
    const parsed = JSON.parse(p);
    return {
      position: parsed.position,
      data: Buffer.from(parsed.data, 'hex')
    };
  });
};