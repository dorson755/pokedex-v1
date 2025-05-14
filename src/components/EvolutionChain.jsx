import { useEffect } from 'react';  // Make sure this import exists
import useEvolutionChain from '../hooks/useEvolutionChain';

const EvolutionChain = ({ speciesUrl, onPokemonClick }) => {
  const { chain, loading } = useEvolutionChain(speciesUrl);

  // Add this useEffect hook
  useEffect(() => {
    if (chain) {
      chain.forEach(evo => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = `https://pokeapi.co/api/v2/pokemon/${evo.name}`;
        link.as = 'fetch';
        document.head.appendChild(link);
      });
    }
  }, [chain]);  // Only runs when chain updates

  // Rest of your existing code remains unchanged
  if (loading) return <div className="glass-panel font-bold text-white p-4">Loading evolution chain...</div>;
  if (!chain) return null;

  return (
    <div className="glass-panel p-6 mt-8">
      <h3 className="text-xl font-bold text-white mb-4">Evolution Chain</h3>
      <div className="flex flex-wrap justify-center gap-6">
        {chain.map((evo, index) => (
          <div key={evo.id} className="flex items-center gap-6">
            {index > 0 && <span className="text-white/50">→</span>}
            <button
              onClick={() => onPokemonClick(evo.name)}
              className="group transition-transform hover:scale-105"
            >
              <div className="text-center">
                <img
                  src={evo.sprite}
                  alt={evo.name}
                  loading="lazy"
                  decoding="async"
                  className="w-24 h-24 object-contain mx-auto group-hover:brightness-125 transition-all"
                />
                <p className="text-white font-medium capitalize group-hover:text-blue-300">
                  {evo.name}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvolutionChain;