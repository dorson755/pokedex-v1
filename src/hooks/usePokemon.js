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

    // Offensive calculations
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
    typeStrengths: {},
    moves: [],
    variants: []
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
          typeStrengths: {},
          moves: [],
          variants: []
        }));
        
        const identifier = searchQuery?.toLowerCase() || Math.floor(Math.random() * 1024) + 1;

        // 1. Fetch Pokémon data
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${identifier}`,
          { signal: controller.signal }
        );

        // 2. Fetch additional data in parallel
        const [typeResponses, speciesResponse] = await Promise.all([
          Promise.all(data.types.map(t => 
            axios.get(t.type.url, { signal: controller.signal })
          )),
          axios.get(data.species.url, { signal: controller.signal })
        ]);

        // 3. Process all data
        const movesData = await processMoves(data.moves);
        const { weaknesses, strengths } = processTypeRelations(
          typeResponses.map(r => r.data)
        );
        
        const variants = speciesResponse.data.varieties
          .filter(v => !v.is_default)
          .map(v => ({
            name: v.pokemon.name, // Removed .split('-')[0] to keep full name
            url: v.pokemon.url
          }));

        if (!controller.signal.aborted) {
          setState({
            pokemon: data,
            loading: false,
            error: null,
            typeWeaknesses: weaknesses,
            typeStrengths: strengths,
            moves: movesData,
            variants
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
            typeStrengths: {},
            moves: [],
            variants: []
          });
        }
      }
    };

    fetchPokemon();
    return () => controller.abort();
  }, [searchQuery]);

  return state;
}