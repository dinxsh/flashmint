import { ethers } from 'ethers';
import FlashMintABI from './FlashMint.json'; // Export ABI from Hardhat build

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const contract = new ethers.Contract(
  process.env.FLASHMINT_ADDRESS!,
  FlashMintABI,
  signer
);

export default contract; 