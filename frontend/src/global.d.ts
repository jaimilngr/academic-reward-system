import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

declare module 'ethers' {
  export * from 'ethers/lib.esm/ethers';
}