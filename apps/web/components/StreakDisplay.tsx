import React from 'react';

export default function StreakDisplay({ streak, level }: { streak: number, level: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold">{level}</span>
      <span className="text-sm text-gray-500">Streak: {streak}</span>
    </div>
  );
} 