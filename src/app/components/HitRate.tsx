// webapp/src/app/components/HitRate.tsx
import React from 'react';

interface HitRateProps {
  hitRate: number | null;
}

export default function HitRate({ hitRate }: HitRateProps) {
  if (hitRate === null) return null;

  const hitRateColor =
    hitRate >= 60
      ? 'text-green-600'
      : hitRate >= 50
      ? 'text-yellow-600'
      : 'text-red-600';

  return (
    <div className="max-w-md mx-auto mb-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
          Daily Performance
        </p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500">Hit Rate</p>
            <p className={`text-4xl font-bold ${hitRateColor}`}>
              {hitRate.toFixed(1)}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">
              Settled predictions only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}