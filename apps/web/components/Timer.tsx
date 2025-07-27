import React from 'react';

export default function Timer({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <div className="text-lg font-mono">
      Next mint in: {mins}:{secs.toString().padStart(2, '0')}
    </div>
  );
} 