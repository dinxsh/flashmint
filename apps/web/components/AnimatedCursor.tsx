import React from 'react';

export default function AnimatedCursor({ onClick, disabled }: { onClick: () => void, disabled: boolean }) {
  return (
    <button
      className={`w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500 to-pink-600 flex items-center justify-center shadow-lg transition-transform duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Mint NFT"
      aria-pressed={!disabled}
      tabIndex={0}
    >
      <span className="text-4xl animate-pulse" role="img" aria-label="Flash">⚡️</span>
    </button>
  );
} 