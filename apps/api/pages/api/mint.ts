import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';
import contract from '../../lib/contract';
import farcaster from '../../lib/farcaster';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Missing address' });

  // Check cooldown in Redis
  const cooldownKey = `cooldown:${address}`;
  const lastMint = await redis.get(cooldownKey);
  const now = Date.now();
  if (lastMint && now - Number(lastMint) < 4 * 60 * 60 * 1000) {
    return res.status(429).json({ error: 'Cooldown active' });
  }

  // Get streak from Redis
  const streakKey = `streak:${address}`;
  let streak = Number(await redis.get(streakKey)) || 0;
  streak += 1;

  // Mint NFT
  const tx = await contract.mint(address, streak);
  await tx.wait();

  // Update cooldown and streak
  await redis.set(cooldownKey, now);
  await redis.set(streakKey, streak);

  // Post to Farcaster
  try {
    await farcaster.publishCast({
      signer_uuid: process.env.FARCASTER_SIGNER_UUID!,
      text: `I just minted my FlashMint NFT (streak: ${streak})! ⚡️\nhttps://your-app-url.xyz`,
    });
  } catch (e) {
    // Log but don't fail the mint if Farcaster post fails
    console.error('Farcaster post failed:', e);
  }

  res.status(200).json({ success: true, tx: tx.hash, streak });
} 