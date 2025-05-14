import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, onRandom }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="glass-panel flex-1 flex items-center pr-4">
          <MagnifyingGlassIcon className="w-5 h-5 text-white/70 ml-4" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search Pokémon by name or ID..."
            className="w-full bg-transparent border-0 text-white py-4 px-4 focus:ring-0"
          />
        </div>
        
        <button
          type="submit"
          className="glass-panel px-6 hover:bg-white/20 transition-colors"
        >
          Search
        </button>
        
        <button
          type="button"
          onClick={() => {
            onSearch('');
            onRandom();
          }}
          className="glass-panel px-4 hover:bg-white/20 transition-colors"
          aria-label="Random Pokémon"
        >
          <SparklesIcon className="w-5 h-5 text-yellow-400" />
        </button>
      </form>
    </div>
  );
}