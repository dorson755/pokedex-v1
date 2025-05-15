import { useState, useEffect } from 'react';
import axios from 'axios';

const processTypeRelations = (typeResponses) => {
  const weaknesses = {};
  const strengths = {};

  typeResponses.forEach(({ damage_relations }) => {
    // Defensive calculations
    damage_relations.double_damage_from.forEach(({ name }) => {
      weaknesses[name] = (weaknesses[name] || 1) * 2;
    });
    damage_relations.half_damage_from.forEach(({ name }) => {
      weaknesses[name] = (weaknesses[name] || 1) * 0.5;
    });
    damage_relations.no_damage_from.forEach(({ name }) => {
      weaknesses[name] = 0;
    });

    // Offensive calculations (FIXED)
    damage_relations.double_damage_to.forEach(({ name }) => {
      strengths[name] = (strengths[name] || 1) * 2;
    });
  });

  // Filter out 1× multipliers
  const filteredStrengths = Object.fromEntries(
    Object.entries(strengths).filter(([_, val]) => val !== 1)
  );

  return { weaknesses, strengths: filteredStrengths };
};

const processMoves = async (moves) => {
  const moveRequests = moves.map(m => 
    axios.get(m.move.url).then(res => ({
      name: m.move.name,
      data: {
        accuracy: res.data.accuracy,
        power: res.data.power,
        pp: res.data.pp,
        type: res.data.type.name,
        damageClass: res.data.damage_class.name,
        effect: res.data.effect_entries.find(e => e.language.name === 'en')?.effect
      }
    }))
  );
  
  return Promise.all(moveRequests);
};

export default function usePokemon(searchQuery) {
  const [state, setState] = useState({
    pokemon: null,
    loading: true,
    error: null,
    typeWeaknesses: {},
    typeStrengths: {} // Added strengths
  });

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPokemon = async () => {
      try {
        setState(prev => ({ 
          ...prev, 
          loading: true, 
          error: null,
          typeWeaknesses: {},
          typeStrengths: {} 
        }));
        
        const identifier = searchQuery?.toLowerCase() || Math.floor(Math.random() * 1024) + 1;
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${identifier}`,
          { signal: controller.signal }
        );

        const typeResponses = await Promise.all(
          data.types.map(t => 
            axios.get(t.type.url, { signal: controller.signal })
          ) // Added closing parenthesis for map
        );
        const movesData = await processMoves(data.moves);
        const { weaknesses, strengths } = processTypeRelations(
          typeResponses.map(r => r.data)
        );

        if (!controller.signal.aborted) {
          setState({
            pokemon: data,
            loading: false,
            error: null,
            typeWeaknesses: weaknesses,
            typeStrengths: strengths,
            moves: movesData // Add this line

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
            typeWeaknesses: {},
            typeStrengths: {}
          });
        }
      }
    };

    fetchPokemon();
    return () => controller.abort();
  }, [searchQuery]);

  return state;
}