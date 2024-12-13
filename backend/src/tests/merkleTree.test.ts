import { createMerkleTree, getGigProof, verifyMerkleProof } from '../utils/merkleTreeUtils';
import { IGig } from '../types';

describe('Merkle Tree Utilities', () => {
  // Mock gig data for testing
  const mockGigs: IGig[] = [
    {
      id: '1',
      clientAddress: '0x1234567890123456789012345678901234567890',
      title: 'Web Design Project',
      skillCategory: ['Design'],
      preferredLocation: 'Remote',
      experienceLevel: 'INTERMEDIATE',
      projectDescription: 'Create a modern website design',
      files: [],
      projectDuration: { weeks: 4 },
      price: 1000,
      status: 'CREATED',
      createdAt: new Date(),
      merkleProof: [],
      clientDescription: 'Client looking for web design',
    },
    {
      id: '2',
      clientAddress: '0x9876543210987654321098765432109876543210',
      title: 'Mobile App Development',
      skillCategory: ['Development'],
      preferredLocation: 'Onsite',
      experienceLevel: 'EXPERT',
      projectDescription: 'Develop a cross-platform mobile app',
      files: [],
      projectDuration: { weeks: 8 },
      price: 5000,
      status: 'CREATED',
      createdAt: new Date(),
      merkleProof: [],
    }
  ];

  describe('createMerkleTree', () => {
    it('should create a Merkle tree with the correct root', () => {
      const { tree, root } = createMerkleTree(mockGigs);
      
      expect(tree).toBeTruthy();
      expect(root).toBeTruthy();
      expect(typeof root).toBe('string');
      expect(root.length).toBeGreaterThan(0);
    });

    it('should create unique roots for different gig sets', () => {
      const { root: root1 } = createMerkleTree(mockGigs);
      const differentGigs = [...mockGigs, {
        ...mockGigs[0],
        id: '3',
        title: 'Different Gig'
      }];
      const { root: root2 } = createMerkleTree(differentGigs);

      expect(root1).not.toEqual(root2);
    });
  });

  describe('getGigProof', () => {
    it('should generate a proof for a specific gig', () => {
      const { tree } = createMerkleTree(mockGigs);
      const targetGig = mockGigs[0];
      
      const proof = getGigProof(targetGig, tree);
      
      expect(Array.isArray(proof)).toBeTruthy();
      expect(proof.length).toBeGreaterThan(0);
    });
  });

  describe('verifyMerkleProof', () => {
    it('should verify a valid Merkle proof', () => {
      const { tree, root } = createMerkleTree(mockGigs);
      const targetGig = mockGigs[0];
      
      const proof = getGigProof(targetGig, tree);
      const isVerified = verifyMerkleProof(targetGig, proof, root);
      
      expect(isVerified).toBeTruthy();
    });

    it('should reject an invalid Merkle proof', () => {
      const { tree, root } = createMerkleTree(mockGigs);
      const targetGig = mockGigs[0];
      const differentGig = {
        ...targetGig,
        title: 'Tampered Gig'
      };
      
      const proof = getGigProof(targetGig, tree);
      const isVerified = verifyMerkleProof(differentGig, proof, root);
      
      expect(isVerified).toBeFalsy();
    });
  });
});