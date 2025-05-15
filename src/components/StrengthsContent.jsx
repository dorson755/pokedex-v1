import { memo } from 'react';
import LoadingSkeleton from './LoadingSkeleton';

const StrengthsContent = memo(({ typeStrengths, typeColors }) => {
  if (!typeStrengths || Object.keys(typeStrengths).length === 0) {
    return <LoadingSkeleton count={6} />;
  }

  return (
    <>
      <h3 className="text-2xl font-bold text-white mb-4">Offensive Strengths</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(typeStrengths).map(([typeName, multiplier]) => (
          <div
            key={typeName}
            className={`p-2 rounded-lg flex items-center justify-between ${
              typeColors[typeName] || 'bg-white/10'
            }`}
          >
            <span className="capitalize text-sm text-white">
              {typeName.replace(/-/g, ' ')}
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-black/20 text-white">
              {multiplier}x
            </span>
          </div>
        ))}
      </div>
    </>
  );
});

export default StrengthsContent;