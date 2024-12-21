import Artisan from "../models/Artisan.ts";
import Gig from "../models/Gig.ts";
import { deserializeProof, verifyMerkleProof } from "../utils/merkleTreeUtils.ts";

export const verifyAllEntries = async () => {
  try {
    // Verify all gigs
    const gigs = await Gig.find();
    const gigVerificationResults = await Promise.all(
      gigs.map(async (gig) => {
        const proof = deserializeProof(gig.merkleProof || []);
        const isValid = verifyMerkleProof(
          gig.toObject(),
          proof,
          gig.merkleRoot ?? '', // Provide a default empty string value
          'gig'
        );
        return {
          id: gig.id,
          isValid
        };
      })
    );

    // Verify all artisans
    const artisans = await Artisan.find();
    const artisanVerificationResults = await Promise.all(
      artisans.map(async (artisan) => {
        const proof = deserializeProof(artisan.merkleProof || []);
        const isValid = verifyMerkleProof(
          artisan.toObject(),
          proof,
          artisan.merkleRoot ?? '', // Provide a default empty string value
          'artisan'
        );
        return {
          id: artisan.id,
          isValid
        };
      })
    );

    return {
      gigs: gigVerificationResults,
      artisans: artisanVerificationResults
    };
  } catch (error) {
    console.error('Error verifying entries:', error);
    throw error;
  }
};