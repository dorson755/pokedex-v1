import { memo } from 'react';
import LoadingSkeleton from './LoadingSkeleton';

const VariantsContent = memo(({ variants, onVariantSelect, isLoading }) => {
  const getVariantName = (variant) => {
  // Split the name into parts (e.g., "pikachu-libre" → ["pikachu", "libre"])
  const parts = variant.name.split('-');

  // Process each part for special cases and capitalization.
  const processedParts = parts.map((part) => {
    if (part === 'gmax') return 'Gigantamax';
    if (part === 'mega') return 'Mega';
    return part.charAt(0).toUpperCase() + part.slice(1);
  });

  // Handle Mega X/Y explicitly
  if (processedParts.includes('Mega')) {
    if (processedParts.includes('X')) return 'Mega X';
    if (processedParts.includes('Y')) return 'Mega Y';
  }

  // Join parts with " - " for display (e.g., "Pikachu - Libre")
  return processedParts.length > 1
    ? `${processedParts[0]} - ${processedParts.slice(1).join(' ')}`
    : processedParts[0];
};

  if (isLoading) return <LoadingSkeleton variant="move" count={3} />;

  if (!variants?.length) {
    return <div className="text-white/80 italic p-4">No alternate forms available</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4">Alternate Forms</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {variants.map(variant => (
          <button
            key={variant.url}
            onClick={() => onVariantSelect(variant.url)}
            className="glass-panel p-3 hover:bg-white/10 transition-all rounded-lg"
          >
            <span className="capitalize text-white">
              {getVariantName(variant)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});

export default VariantsContent;