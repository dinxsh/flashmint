import React from 'react';

export default function AnimatedCursor({ onClick, disabled }: { onClick: () => void, disabled: boolean }) {
  return (
    <button
      className={`w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center shadow-lg transition-transform duration-200 ${disabled ? 'opacity-50' : 'hover:scale-110'}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Mint NFT"
    >
      <span className="text-4xl animate-pulse">⚡️</span>
    </button>
  );
} 