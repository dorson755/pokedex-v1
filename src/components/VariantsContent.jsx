import { memo } from 'react';
import LoadingSkeleton from './LoadingSkeleton';

const VariantsContent = memo(({ variants, onVariantSelect, isLoading }) => {
  // Improved variant name formatter
  const getVariantName = (variant) => {
    // Handle special cases first
    if (variant.name.includes('gmax')) return 'Gigantamax';
    if (variant.name.includes('mega')) {
      return variant.name.includes('-x') ? 'Mega X' : 
             variant.name.includes('-y') ? 'Mega Y' : 'Mega';
    }

    // Extract form name from URL structure
    const parts = variant.url.split('/');
    const idWithForm = parts[parts.length - 2]; // Gets "25-pikachu-rock-star" from URL
    
    if (idWithForm.includes('-')) {
      const formName = idWithForm.split('-').slice(1).join(' ');
      return formName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return 'Alternate Form';
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