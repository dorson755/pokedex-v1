import { useState } from 'react';
import PokemonCard from './components/PokemonCard';
import SearchBar from './components/SearchBar';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [forceRefresh, setForceRefresh] = useState(Date.now());

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-4">
          Pokédex Pro
        </h1>
        
        <SearchBar 
          onSearch={setSearchQuery}
          onRandom={() => setForceRefresh(Date.now())}
        />
        
      </header>
      
      <PokemonCard 
        searchQuery={searchQuery} 
        key={forceRefresh}
      />
      
      <footer className="mt-12 text-center text-white/50 text-sm">
        Data from <a href="https://pokeapi.co" className="hover:text-white underline">PokéAPI</a>
      </footer>
    </main>
  );
}