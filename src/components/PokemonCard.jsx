import { useEffect } from 'react';
import { SpeakerWaveIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import usePokemon from '../hooks/usePokemon';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorMessage from './ErrorMessage';

const PokemonCard = () => {
  const { pokemon, loading, error, fetchRandomPokemon } = usePokemon();

  const playSound = () => {
    if (!pokemon?.cries?.latest) return;
    const audio = new Audio(pokemon.cries.latest);
    audio.volume = 0.3;
    audio.play().catch(e => console.error('Audio error:', e));
  };

  return (
    <>
      {loading && <LoadingSkeleton />}
      
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={fetchRandomPokemon} 
        />
      )}

      {pokemon && (
        <div className="glass-panel max-w-2xl mx-auto p-6 md:p-8 space-y-6 relative group">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold capitalize text-white">
                {pokemon.name}
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={playSound}
                className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
                aria-label="Play cry"
              >
                <SpeakerWaveIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
              
              <button
                onClick={fetchRandomPokemon}
                className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
                aria-label="Refresh"
              >
                <ArrowPathIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Image Section */}
            <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/placeholder-pokeball.png';
                }}
              />
            </div>

            {/* Stats Section */}
            <div className="space-y-6">
              <TypeBadges types={pokemon.types} />
              <StatsGrid stats={pokemon.stats} />
              
              <div className="grid grid-cols-2 gap-4">
                <InfoBox label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
                <InfoBox label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
                <InfoBox label="Base XP" value={pokemon.base_experience || '?'} />
                <InfoBox 
                  label="Abilities" 
                  value={pokemon.abilities.filter(a => !a.is_hidden).map(a => a.ability.name).join(', ')} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Sub-components
const TypeBadges = ({ types }) => (
  <div className="flex flex-wrap gap-2">
    {types.map((type) => (
      <span
        key={type.type.name}
        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
          typeColors[type.type.name] || 'bg-white/10 text-white'
        }`}
      >
        {type.type.name}
      </span>
    ))}
  </div>
);

const typeColors = {
  normal: 'bg-gray-400 text-gray-900',
  fire: 'bg-red-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-300 text-gray-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-600 text-white',
  ground: 'bg-amber-600 text-white',
  flying: 'bg-sky-400 text-gray-900',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-gray-900',
  rock: 'bg-amber-800 text-white',
  ghost: 'bg-purple-800 text-white',
  dragon: 'bg-indigo-600 text-white',
  dark: 'bg-gray-800 text-white',
  steel: 'bg-gray-500 text-white',
  fairy: 'bg-pink-300 text-gray-900',
};

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-3 gap-3">
    {stats.map((stat) => (
      <div key={stat.stat.name} className="bg-white/5 p-2 rounded-lg text-center">
        <p className="text-xs text-white/70 uppercase tracking-wider mb-1">
          {stat.stat.name.replace('-', ' ')}
        </p>
        <p className="text-lg font-bold text-white">
          {stat.base_stat}
          <span className="text-xs ml-1 opacity-70">
            ({stat.effort > 0 ? `+${stat.effort}` : ''})
          </span>
        </p>
      </div>
    ))}
  </div>
);

const InfoBox = ({ label, value }) => (
  <div className="bg-white/5 p-3 rounded-lg">
    <p className="text-xs text-white/70 uppercase tracking-wider">{label}</p>
    <p className="text-base font-medium text-white truncate" title={value}>
      {value || 'Unknown'}
    </p>
  </div>
);

export default PokemonCard;