import React from 'react';

export default function BoostButton({ onBoost, disabled }: { onBoost: () => void, disabled: boolean }) {
  return (
    <button
      className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onBoost}
      disabled={disabled}
      aria-label="Boost and skip cooldown for 0.5 USDC"
      tabIndex={0}
    >
      🚀 Boost (0.5 USDC)
    </button>
  );
} 