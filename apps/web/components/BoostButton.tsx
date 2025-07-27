import React from 'react';

export default function BoostButton({ onBoost, disabled }: { onBoost: () => void, disabled: boolean }) {
  return (
    <button
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      onClick={onBoost}
      disabled={disabled}
    >
      🚀 Boost (0.5 USDC)
    </button>
  );
} 