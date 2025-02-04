import { createMerkleTree, getProof, verifyMerkleProof, serializeProof, deserializeProof } from '../utils/merkleTreeUtils.js';
import { IGig } from '../types/index.js';

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
    it('should create a Merkle tree with the correct root for gigs', () => {
      const { tree, root } = createMerkleTree(mockGigs, 'gig');
      
      expect(tree).toBeTruthy();
      expect(root).toBeTruthy();
      expect(typeof root).toBe('string');
      expect(root.length).toBe(64); // SHA256 hex string length
    });

    it('should create unique roots for different gig sets', () => {
      const { root: root1 } = createMerkleTree(mockGigs, 'gig');
      const differentGigs = [...mockGigs, {
        ...mockGigs[0],
        id: '3',
        title: 'Different Gig'
      }];
      const { root: root2 } = createMerkleTree(differentGigs, 'gig');

      expect(root1).not.toEqual(root2);
    });

    it('should create consistent roots for same data', () => {
      const { root: root1 } = createMerkleTree(mockGigs, 'gig');
      const { root: root2 } = createMerkleTree([...mockGigs], 'gig');

      expect(root1).toEqual(root2);
    });
  });

  describe('getProof and serializeProof', () => {
    it('should generate and serialize a proof for a specific gig', () => {
      const { tree } = createMerkleTree(mockGigs, 'gig');
      const targetGig = mockGigs[0];
      
      const proof = getProof(targetGig, tree, 'gig');
      const serializedProof = serializeProof(proof);
      
      expect(Array.isArray(proof)).toBeTruthy();
      expect(proof.length).toBeGreaterThan(0);
      expect(serializedProof[0]).toHaveProperty('position');
      expect(serializedProof[0]).toHaveProperty('data');
      expect(typeof serializedProof[0].data).toBe('string');
    });

    it('should handle proof serialization and deserialization', () => {
      const { tree } = createMerkleTree(mockGigs, 'gig');
      const targetGig = mockGigs[0];
      
      const proof = getProof(targetGig, tree, 'gig');
      const serializedProof = serializeProof(proof);
      const serializedStrings = serializedProof.map(p => JSON.stringify(p));
      const deserializedProof = deserializeProof(serializedStrings);
      
      expect(deserializedProof[0].position).toEqual(proof[0].position);
      expect(deserializedProof[0].data.toString('hex')).toEqual(proof[0].data.toString('hex'));
    });
  });

  describe('verifyMerkleProof', () => {
    it('should verify a valid Merkle proof', () => {
      const { tree, root } = createMerkleTree(mockGigs, 'gig');
      const targetGig = mockGigs[0];
      
      const proof = getProof(targetGig, tree, 'gig');
      const isVerified = verifyMerkleProof(targetGig, proof, root, 'gig');
      
      expect(isVerified).toBeTruthy();
    });

    it('should reject an invalid Merkle proof', () => {
      const { tree, root } = createMerkleTree(mockGigs, 'gig');
      const targetGig = mockGigs[0];
      const tamperedGig = {
        ...targetGig,
        title: 'Tampered Gig'
      };
      
      const proof = getProof(targetGig, tree, 'gig');
      const isVerified = verifyMerkleProof(tamperedGig, proof, root, 'gig');
      
      expect(isVerified).toBeFalsy();
    });

    it('should verify proof after serialization and deserialization', () => {
      const { tree, root } = createMerkleTree(mockGigs, 'gig');
      const targetGig = mockGigs[0];
      
      const proof = getProof(targetGig, tree, 'gig');
      const serializedProof = serializeProof(proof);
      const serializedStrings = serializedProof.map(p => JSON.stringify(p));
      const deserializedProof = deserializeProof(serializedStrings);
      
      const isVerified = verifyMerkleProof(targetGig, deserializedProof, root, 'gig');
      expect(isVerified).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should handle empty gig list', () => {
      expect(() => createMerkleTree([], 'gig')).not.toThrow();
    });

    it('should handle single gig', () => {
      const { tree, root } = createMerkleTree([mockGigs[0]], 'gig');
      const proof = getProof(mockGigs[0], tree, 'gig');
      const isVerified = verifyMerkleProof(mockGigs[0], proof, root, 'gig');
      
      expect(isVerified).toBeTruthy();
    });

    it('should maintain proof validity with growing tree', () => {
      // Start with one gig
      const { tree: tree1, root: root1 } = createMerkleTree([mockGigs[0]], 'gig');
      const proof1 = getProof(mockGigs[0], tree1, 'gig');
      
      // Add second gig
      const { tree: tree2, root: root2 } = createMerkleTree(mockGigs, 'gig');
      const proof2 = getProof(mockGigs[0], tree2, 'gig');
      
      // Both proofs should be valid for their respective trees
      expect(verifyMerkleProof(mockGigs[0], proof1, root1, 'gig')).toBeTruthy();
      expect(verifyMerkleProof(mockGigs[0], proof2, root2, 'gig')).toBeTruthy();
    });
  });
});