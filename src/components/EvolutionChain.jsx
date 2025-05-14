import useEvolutionChain from '../hooks/useEvolutionChain';

const EvolutionChain = ({ speciesUrl }) => {
  const { chain, loading } = useEvolutionChain(speciesUrl);

  if (loading) return <div className="glass-panel p-4">Loading evolution chain...</div>;
  if (!chain) return null;

  return (
    <div className="glass-panel p-6 mt-8">
      <h3 className="text-xl font-bold text-white mb-4">Evolution Chain</h3>
      <div className="flex flex-wrap justify-center gap-6">
        {chain.map((evo, index) => (
          <div key={evo.id} className="flex items-center gap-6">
            {index > 0 && <span className="text-white/50">→</span>}
            <div className="text-center">
              <img
                src={evo.sprite}
                alt={evo.name}
                className="w-24 h-24 object-contain mx-auto"
              />
              <p className="text-white font-medium capitalize">{evo.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvolutionChain;