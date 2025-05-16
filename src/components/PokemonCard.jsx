import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  SpeakerWaveIcon, 
  ArrowPathIcon,
  SparklesIcon,
  XMarkIcon 
} from '@heroicons/react/24/solid';
import usePokemon from '../hooks/usePokemon';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorMessage from './ErrorMessage';
import EvolutionChain from './EvolutionChain';
import WeaknessContent from './WeaknessContent';
import StrengthsContent from './StrengthsContent';
import SectionGrid from './SectionGrid';
import MoveListContent from './MoveListContent';
import VariantsContent from './VariantsContent';


// Main component wrapped in memo
const PokemonCard = memo(({ searchQuery, onRandom, onLoadComplete, onEvolutionClick }) => {
  const [isShiny, setIsShiny] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const { pokemon, loading, error, typeWeaknesses, typeStrengths, moves, variants } = usePokemon(searchQuery);
  // Lightbox Component
  const InfoLightbox = memo(({ children, onClose }) => {
    const handleKeyDown = useCallback((e) => {
      if (e.key === 'Escape') onClose();
    }, [onClose]);


    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        onKeyDown={handleKeyDown}
      >
        <div 
          className="glass-panel max-w-2xl w-full p-6 rounded-xl relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    );
  });

  // Section Button
  const SectionButton = memo(({ title, onClick }) => (
    <button
      onClick={onClick}
      className="glass-panel p-4 hover:bg-white/10 transition-all rounded-xl flex items-center justify-center aspect-square"
    >
      <span className="text-white font-medium text-center text-sm md:text-base">
        {title}
      </span>
    </button>
  ));
  //Variant Handler
  const handleVariantSelect = useCallback((url) => {
    const variantId = url.split('/').slice(-2, -1)[0];
    onEvolutionClick(variantId); // Reuse your evolution click handler
  }, [onEvolutionClick]);

  // Memoize sprite URL
  const spriteUrl = useMemo(() => {
    return isShiny 
      ? pokemon?.sprites.other['official-artwork'].front_shiny 
      : pokemon?.sprites.other['official-artwork'].front_default;
  }, [isShiny, pokemon?.sprites]);

  // Memoize sound playback
  const playSound = useCallback(() => {
    if (!pokemon?.cries?.latest) return;
    const audio = new Audio(pokemon.cries.latest);
    audio.volume = 0.3;
    audio.play().catch(e => console.error('Audio error:', e));
  }, [pokemon?.cries?.latest]);

  useEffect(() => {
    if (!loading) onLoadComplete?.();
  }, [loading, onLoadComplete]);

  useEffect(() => {
    setIsShiny(false);
  }, [pokemon?.id]);

  return (
    <>
      {loading && <LoadingSkeleton />}
      
      {error && (
        <ErrorMessage message={error} onRetry={onRandom} />
      )}

      {pokemon && (
        <div className="glass-panel max-w-2xl mx-auto p-6 md:p-8 space-y-6 relative group">
          {/* Header Section */}
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
              <ShinyToggle isShiny={isShiny} setIsShiny={setIsShiny} />
              <SoundButton playSound={playSound} />
              <RefreshButton onRandom={onRandom} />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <PokemonImage 
              spriteUrl={spriteUrl} 
              name={pokemon.name} 
              isShiny={isShiny}
            />
            
            <div className="space-y-6">
              <TypeBadges types={pokemon.types} />
              <StatsGrid stats={pokemon.stats} />
              <InfoSection pokemon={pokemon} />
            </div>
          </div>
          <SectionGrid setActiveSection={setActiveSection} />
          
          <EvolutionChain 
            speciesUrl={pokemon.species.url}
            onPokemonClick={onEvolutionClick}
          />
        </div>
      )}
      {/* Conditional Loading */}
      {activeSection === 'weaknesses' && (
        <InfoLightbox onClose={() => setActiveSection(null)}>
          <WeaknessContent 
            typeWeaknesses={typeWeaknesses} 
            typeColors={typeColors} 
          />
        </InfoLightbox>
      )}

      {activeSection === 'strengths' && (
        <InfoLightbox onClose={() => setActiveSection(null)}>
          <StrengthsContent 
            typeStrengths={typeStrengths}  // Should be an object like {grass: 2, bug: 2}
            typeColors={typeColors} 
          />
        </InfoLightbox>
      )}
      {activeSection === 'moves' && (
        <InfoLightbox onClose={() => setActiveSection(null)}>
          <MoveListContent moves={moves} />
        </InfoLightbox>
      )}
      {activeSection === 'variants' && (
        <InfoLightbox onClose={() => setActiveSection(null)}>
          <VariantsContent 
            variants={variants}
            onVariantSelect={handleVariantSelect}
            isLoading={loading} // Pass loading state
          />
        </InfoLightbox>
      )}
    </>
  );
});

// Memoized Sub-components
const ShinyToggle = memo(({ isShiny, setIsShiny }) => (
  <button
    onClick={() => setIsShiny(!isShiny)}
    className={`p-2 rounded-full transition-colors ${
      isShiny ? 'bg-yellow-400/20' : 'bg-white/10'
    } hover:bg-white/20`}
    aria-label="Toggle shiny variant"
  >
    <SparklesIcon className="w-5 h-5 text-yellow-400" />
  </button>
));

const SoundButton = memo(({ playSound }) => (
  <button
    onClick={playSound}
    className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
    aria-label="Play cry"
  >
    <SpeakerWaveIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
  </button>
));

const RefreshButton = memo(({ onRandom }) => (
  <button
    onClick={onRandom}
    className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
    aria-label="Refresh"
  >
    <ArrowPathIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
  </button>
));

const PokemonImage = memo(({ spriteUrl, name, isShiny }) => (
  <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden">
    <img
      src={spriteUrl}
      alt={name}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300 pokemon-image"
      onLoad={(e) => {
        e.target.classList.add('pokemon-image-loaded');
        e.target.classList.remove('pokemon-image');
      }}
      onError={(e) => {
        e.target.src = '/placeholder-pokeball.png';
        e.target.classList.remove('pokemon-image');
      }}
    />
  </div>
));

const InfoSection = memo(({ pokemon }) => (
  <div className="grid grid-cols-2 gap-4">
    <InfoBox label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
    <InfoBox label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
    <InfoBox label="Base XP" value={pokemon.base_experience || '?'} />
    <InfoBox 
      label="Abilities" 
      value={pokemon.abilities.filter(a => !a.is_hidden).map(a => a.ability.name).join(', ')} 
    />
  </div>
));


// Sub-components
const TypeBadges = memo(({ types }) => (
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
));

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

const StatItem = memo(({ stat }) => (
  <div className="bg-white/5 p-2 rounded-lg text-center">
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
));

const StatsGrid = memo(({ stats }) => (
  <div className="grid grid-cols-3 gap-3">
    {stats.map((stat) => (
      <StatItem key={stat.stat.name} stat={stat} />
    ))}
  </div>
));


const InfoBox = memo(({ label, value }) => (
  <div className="bg-white/5 p-3 rounded-lg">
    <p className="text-xs text-white/70 uppercase tracking-wider">{label}</p>
    <p className="text-base font-medium text-white truncate" title={value}>
      {value || 'Unknown'}
    </p>
  </div>
));

export default PokemonCard;