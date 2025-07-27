import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { address } = req.query;
  if (!address || typeof address !== 'string') return res.status(400).json({ error: 'Missing address' });

  const cooldownKey = `cooldown:${address}`;
  const streakKey = `streak:${address}`;

  const lastMint = await redis.get(cooldownKey);
  const streak = Number(await redis.get(streakKey)) || 0;

  res.status(200).json({ streak, lastMint });
} 