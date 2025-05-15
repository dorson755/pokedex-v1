const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  if (variant === 'move') {
    return (
      <div className="space-y-2 animate-pulse">
        {[...Array(count)].map((_, i) => (
          <div 
            key={i}
            className="glass-panel h-14 rounded-lg flex items-center justify-between px-4"
          >
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
            <div className="h-5 w-5 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-panel max-w-2xl mx-auto p-8 space-y-6 animate-pulse">
      {/* Existing Card Skeleton */}
      <div className="flex justify-between">
        <div className="space-y-4">
          <div className="h-9 w-48 bg-white/10 rounded-md" />
          <div className="h-6 w-24 bg-white/10 rounded-md" />
        </div>
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full" />
          <div className="w-10 h-10 bg-white/10 rounded-full" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-white/5 rounded-2xl" />
        
        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-white/10 rounded-full" />
            <div className="h-8 w-20 bg-white/10 rounded-full" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-lg" />
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;