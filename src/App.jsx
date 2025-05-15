import { memo, useState, useCallback } from 'react'; // Added useCallback
import PokemonCard from './components/PokemonCard';
import SearchBar from './components/SearchBar';

// Wrap main component in memo to prevent unnecessary re-renders
const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize evolution click handler
  const handleEvolutionClick = useCallback((pokemonName) => {
    setSearchQuery(pokemonName);
  }, []); // Empty array = never recreates

  // Memoize random handler with dependency
  const handleRandom = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    setSearchQuery('');
    setRefreshCount(prev => prev + 1);
  }, [isLoading]); // Only recreate when isLoading changes

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-4">
          Pokédex Pro
        </h1>
        
        <SearchBar 
          onSearch={setSearchQuery} // Already stable
          onRandom={handleRandom} // Now memoized
        />
      </header>
      
      <PokemonCard 
        searchQuery={searchQuery}
        onEvolutionClick={handleEvolutionClick} // Memoized
        key={refreshCount}
        onRandom={handleRandom} // Memoized
        onLoadComplete={useCallback(() => setIsLoading(false), [])} // Memoized
      />
      
      <footer className="mt-12 text-center text-white/50 text-sm">
        Data from <a href="https://pokeapi.co" className="hover:text-white underline">PokéAPI</a>
      </footer>
    </main>
  );
};

export default memo(App); // Prevent parent re-renders from affecting app