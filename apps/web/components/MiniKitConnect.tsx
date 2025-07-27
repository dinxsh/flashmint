import React from 'react';
import { useMiniKit } from '@minikit/core/react';

export default function MiniKitConnect({ onConnect }: { onConnect: (address: string) => void }) {
  const { connect, isConnected, address, isConnecting } = useMiniKit();

  React.useEffect(() => {
    if (isConnected && address) {
      onConnect(address);
    }
  }, [isConnected, address, onConnect]);

  return (
    <div className="mb-6">
      {isConnected ? (
        <span className="text-green-700 font-mono bg-green-100 px-2 py-1 rounded" aria-label={`Connected: ${address}`}>Connected: {address.slice(0, 6)}...{address.slice(-4)}</span>
      ) : (
        <button
          className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-400"
          onClick={connect}
          disabled={isConnecting}
          aria-label="Connect Wallet and Farcaster"
          tabIndex={0}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet & Farcaster'}
        </button>
      )}
    </div>
  );
} 