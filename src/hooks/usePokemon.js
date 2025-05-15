import { useState, useEffect } from 'react';
import axios from 'axios';

const combineTypeEffects = (typeResponses) => {
  const multipliers = {};
  
  typeResponses.forEach(({ damage_relations }) => {
    // Process weaknesses
    damage_relations.double_damage_from.forEach(({ name }) => {
      multipliers[name] = (multipliers[name] || 1) * 2;
    });
    
    // Process resistances
    damage_relations.half_damage_from.forEach(({ name }) => {
      multipliers[name] = (multipliers[name] || 1) * 0.5;
    });
    
    // Process immunities
    damage_relations.no_damage_from.forEach(({ name }) => {
      multipliers[name] = 0;
    });
  });

  return multipliers;
};

export default function usePokemon(searchQuery) {
  const [state, setState] = useState({
    pokemon: null,
    loading: true,
    error: null,
    typeWeaknesses: {}
  });

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPokemon = async () => {
      try {
        setState(prev => ({ 
          ...prev, 
          loading: true, 
          error: null,
          typeWeaknesses: {} 
        }));
        
        const identifier = searchQuery 
          ? searchQuery.toLowerCase()
          : Math.floor(Math.random() * 1024) + 1;

        // Fetch Pokémon data
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${identifier}`,
          { signal: controller.signal }
        );

        // Fetch and process type data
        const typeResponses = await Promise.all(
          data.types.map(t => 
            axios.get(t.type.url, { signal: controller.signal })
          )
        );
        const typeWeaknesses = combineTypeEffects(
          typeResponses.map(r => r.data)
        );

        if (!controller.signal.aborted) {
          setState({
            pokemon: data,
            loading: false,
            error: null,
            typeWeaknesses
          });
        }

      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            pokemon: null,
            loading: false,
            error: error.response?.status === 404 
              ? "Pokémon not found" 
              : "Failed to load Pokémon",
            typeWeaknesses: {}
          });
        }
      }
    };

    fetchPokemon();

    return () => controller.abort();
  }, [searchQuery]);

  return state;
}