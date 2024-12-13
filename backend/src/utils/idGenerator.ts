import { ethers } from 'ethers';

export const generateGigId = (clientAddress: string, title: string): string => { 
  return ethers.keccak256(
    ethers.solidityPacked(
      ['address', 'string', 'uint256'], 
      [clientAddress, title, Date.now()]
    )
  ); 
};