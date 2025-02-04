import { ethers } from 'ethers';
export const generateId = (address, value1, value2) => {
    // Validate address format
    if (!ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address format');
    }
    // Validate value1 and value2 are non-empty strings after trimming
    if (!value1?.trim()) {
        throw new Error('First value cannot be empty');
    }
    if (!value2?.trim()) {
        throw new Error('Second value cannot be empty');
    }
    return ethers.keccak256(ethers.solidityPacked(['address', 'string', 'string'], [address, value1.trim(), value2.trim()]));
};
//# sourceMappingURL=idGenerator.js.map