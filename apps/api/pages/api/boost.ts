import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';
import contract from '../../lib/contract';
import farcaster from '../../lib/farcaster';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Missing address' });

  // TODO: Handle payment verification for 0.5 USDC

  // Get streak from Redis
  const streakKey = `streak:${address}`;
  let streak = Number(await redis.get(streakKey)) || 0;
  streak += 1;

  // Mint NFT (bypassing cooldown)
  const tx = await contract.mint(address, streak);
  await tx.wait();

  // Update streak (no cooldown set)
  await redis.set(streakKey, streak);

  // Post to Farcaster
  try {
    await farcaster.publishCast({
      signer_uuid: process.env.FARCASTER_SIGNER_UUID!,
      text: `I just used a Boost to mint my FlashMint NFT (streak: ${streak})! 🚀\nhttps://your-app-url.xyz`,
    });
  } catch (e) {
    console.error('Farcaster post failed:', e);
  }

  res.status(200).json({ success: true, tx: tx.hash, streak });
} 