/**
 * FlashMint NFT API Endpoint
 * 
 * This API endpoint handles the minting of FlashMint NFTs with streak tracking,
 * cooldown management, and social media integration via Farcaster.
 * 
 * @file apps/api/pages/api/mint.ts
 * @author FlashMint Team
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';
import contract from '../../lib/contract';
import farcaster from '../../lib/farcaster';

/**
 * Main handler function for the mint NFT API endpoint
 * 
 * This function processes POST requests to mint NFTs for users while:
 * - Enforcing a 4-hour cooldown period between mints
 * - Tracking and incrementing user streak counts
 * - Publishing minting achievements to Farcaster
 * 
 * @param req - Next.js API request object containing user data
 * @param res - Next.js API response object for sending responses
 * @returns JSON response with success status, transaction hash, and streak count
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method - only POST requests are allowed
  if (req.method !== 'POST') return res.status(405).end();
  
  // Extract wallet address from request body
  const { address } = req.body;
  
  // Validate required address parameter
  if (!address) return res.status(400).json({ error: 'Missing address' });

  // === COOLDOWN VALIDATION ===
  // Check if user is still in cooldown period (4 hours)
  const cooldownKey = `cooldown:${address}`;
  const lastMint = await redis.get(cooldownKey);
  const now = Date.now();
  
  // Calculate if 4 hours (4 * 60 * 60 * 1000 ms) have passed since last mint
  if (lastMint && now - Number(lastMint) < 4 * 60 * 60 * 1000) {
    return res.status(429).json({ error: 'Cooldown active' });
  }

  // === STREAK MANAGEMENT ===
  // Retrieve and increment user's current streak count
  const streakKey = `streak:${address}`;
  let streak = Number(await redis.get(streakKey)) || 0; // Default to 0 if no streak exists
  streak += 1; // Increment streak for this mint

  // === NFT MINTING ===
  // Execute the mint transaction on the blockchain
  const tx = await contract.mint(address, streak);
  await tx.wait(); // Wait for transaction confirmation

  // === DATA PERSISTENCE ===
  // Update Redis with new cooldown timestamp and streak count
  await redis.set(cooldownKey, now);
  await redis.set(streakKey, streak);

  // === SOCIAL MEDIA INTEGRATION ===
  // Attempt to post achievement to Farcaster (non-blocking)
  try {
    await farcaster.publishCast({
      signer_uuid: process.env.FARCASTER_SIGNER_UUID!,
      text: `I just minted my FlashMint NFT (streak: ${streak})! ⚡️\nhttps://your-app-url.xyz`,
    });
  } catch (e) {
    // Log Farcaster errors but don't fail the mint operation
    console.error('Farcaster post failed:', e);
  }

  // === SUCCESS RESPONSE ===
  // Return successful response with transaction details
  res.status(200).json({ success: true, tx: tx.hash, streak });
}
