import { useState, useEffect } from 'react';
import axios from 'axios';

const parseEvolutionChain = async (chain) => {
  const result = [];
  
  const processChain = async (chainLink) => {
    const speciesResponse = await axios.get(chainLink.species.url);
    const pokemonResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${speciesResponse.data.name}`
    );
    
    result.push({
      name: speciesResponse.data.name,
      id: pokemonResponse.data.id,
      sprite: pokemonResponse.data.sprites.other['official-artwork'].front_default
    });

    if (chainLink.evolves_to.length > 0) {
      await processChain(chainLink.evolves_to[0]);
    }
  };

  await processChain(chain);
  return result;
};

export default function useEvolutionChain(speciesUrl) {
  const [chain, setChain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvolution = async () => {
      try {
        const speciesRes = await axios.get(speciesUrl);
        const evolutionRes = await axios.get(speciesRes.data.evolution_chain.url);
        
        const parsedChain = await parseEvolutionChain(evolutionRes.data.chain);
        setChain(parsedChain);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
        setChain(null);
      } finally {
        setLoading(false);
      }
    };

    if (speciesUrl) fetchEvolution();
  }, [speciesUrl]);

  return { chain, loading };
}