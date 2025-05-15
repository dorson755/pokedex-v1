import { memo } from 'react';

const WeaknessContent = memo(({ typeWeaknesses, typeColors }) => (
  <>
    <h3 className="text-2xl font-bold text-white mb-4">Type Effectiveness</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {Object.entries(typeWeaknesses).map(([typeName, multiplier]) => (
        <div
          key={typeName}
          className={`p-2 rounded-lg flex items-center justify-between ${
            typeColors[typeName] || 'bg-white/10'
          }`}
        >
          <span className="capitalize text-sm text-white">
            {typeName.replace('-', ' ')}
          </span>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-black/20 text-white">
            {multiplier === 0 ? 'Immune' : `${multiplier}x`}
          </span>
        </div>
      ))}
    </div>
  </>
));

export default WeaknessContent;