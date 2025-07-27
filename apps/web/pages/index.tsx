import React, { useState, useEffect } from 'react';
import AnimatedCursor from '../components/AnimatedCursor';
import Timer from '../components/Timer';
import StreakDisplay from '../components/StreakDisplay';
import BoostButton from '../components/BoostButton';
import MiniKitConnect from '../components/MiniKitConnect';
import axios from 'axios';
import posthog from '../lib/posthog';

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState('Bronze');
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch streak/cooldown on mount
  useEffect(() => {
    if (!address) return;
    axios.get('/api/streak', { params: { address } }).then(res => {
      setStreak(res.data.streak);
      const now = Date.now();
      const lastMint = Number(res.data.lastMint || 0);
      const nextMint = lastMint + 4 * 60 * 60 * 1000;
      setCooldown(Math.max(0, Math.floor((nextMint - now) / 1000)));
      // Set level based on streak
      if (res.data.streak >= 14) setLevel('Gold');
      else if (res.data.streak >= 7) setLevel('Silver');
      else setLevel('Bronze');
    });
  }, [address]);

  // Timer countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleMint = async () => {
    setLoading(true);
    await axios.post('/api/mint', { address });
    setLoading(false);
    // Refresh streak/cooldown
    if (address) {
      const res = await axios.get('/api/streak', { params: { address } });
      setStreak(res.data.streak);
      const now = Date.now();
      const lastMint = Number(res.data.lastMint || 0);
      const nextMint = lastMint + 4 * 60 * 60 * 1000;
      setCooldown(Math.max(0, Math.floor((nextMint - now) / 1000)));
      if (res.data.streak >= 14) setLevel('Gold');
      else if (res.data.streak >= 7) setLevel('Silver');
      else setLevel('Bronze');
      posthog.capture('mint', { address, streak: res.data.streak, level });
    }
  };

  const handleBoost = async () => {
    setLoading(true);
    await axios.post('/api/boost', { address });
    setLoading(false);
    // Refresh streak/cooldown
    if (address) {
      const res = await axios.get('/api/streak', { params: { address } });
      setStreak(res.data.streak);
      const now = Date.now();
      const lastMint = Number(res.data.lastMint || 0);
      const nextMint = lastMint + 4 * 60 * 60 * 1000;
      setCooldown(Math.max(0, Math.floor((nextMint - now) / 1000)));
      if (res.data.streak >= 14) setLevel('Gold');
      else if (res.data.streak >= 7) setLevel('Silver');
      else setLevel('Bronze');
      posthog.capture('boost', { address, streak: res.data.streak, level });
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <MiniKitConnect onConnect={setAddress} />
      <StreakDisplay streak={streak} level={level} />
      <AnimatedCursor onClick={handleMint} disabled={cooldown > 0 || loading || !address} />
      <Timer seconds={cooldown} />
      <BoostButton onBoost={handleBoost} disabled={cooldown === 0 || loading || !address} />
      <span className="sr-only" aria-live="polite">
        {cooldown > 0 ? `Cooldown active. Next mint in ${cooldown} seconds.` : 'Ready to mint!'}
      </span>
    </main>
  );
} 