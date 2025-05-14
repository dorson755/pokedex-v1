import { useState, useEffect } from 'react';
import axios from 'axios';

export default function usePokemon(searchQuery) {
  const [state, setState] = useState({
    pokemon: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPokemon = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const identifier = searchQuery 
          ? searchQuery.toLowerCase()
          : Math.floor(Math.random() * 1024) + 1;

        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${identifier}`,
          { signal: controller.signal }
        );
        
        if (!controller.signal.aborted) {
          setState({
            pokemon: data,
            loading: false,
            error: null
          });
        }

      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            pokemon: null,
            loading: false,
            error: error.response?.status === 404 
              ? "Pokémon not found" 
              : "Failed to load Pokémon"
          });
        }
      }
    };

    fetchPokemon();

    return () => controller.abort();
  }, [searchQuery]);

  return state;
}