import { useState } from 'react';
import PokemonCard from './components/PokemonCard';
import SearchBar from './components/SearchBar';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleEvolutionClick = (pokemonName) => {
    setSearchQuery(pokemonName);
  };
  const handleRandom = () => {
    if (isLoading) return;
    setIsLoading(true);
    setSearchQuery('');
    setRefreshCount(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-4">
          Pokédex Pro
        </h1>
        
        <SearchBar 
          onSearch={setSearchQuery}
          onRandom={handleRandom}
        />
      </header>
      
      <PokemonCard 
        searchQuery={searchQuery}
        onEvolutionClick={handleEvolutionClick}
        key={refreshCount}
        onRandom={handleRandom}
        onLoadComplete={() => setIsLoading(false)}
      />
      
      <footer className="mt-12 text-center text-white/50 text-sm">
        Data from <a href="https://pokeapi.co" className="hover:text-white underline">PokéAPI</a>
      </footer>
    </main>
  );
}