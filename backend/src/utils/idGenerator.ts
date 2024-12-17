import { ethers } from 'ethers';

export const generateId = (clientAddress: string, title: string): string => { 
  return ethers.keccak256(
    ethers.solidityPacked(
      ['address', 'string', 'uint256'], 
      [clientAddress, title, Date.now()]
    )
  ); 
};