import axios from 'axios';

// Create a cache with 5-minute expiration
const cache = new Map();

export const pokeAPI = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 10000,
});

export const getPokemon = async (identifier) => {
  // Check cache first
  const cacheKey = `pokemon-${identifier.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
    return cached.data;
  }

  try {
    const { data } = await pokeAPI.get(`pokemon/${identifier}`);
    
    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  } catch (error) {
    throw new Error(
      error.response?.status === 404 
        ? 'Pokémon not found' 
        : 'Failed to fetch Pokémon data'
    );
  }
};

export const prefetchPokemon = (name) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = `https://pokeapi.co/api/v2/pokemon/${name}`;
  link.as = 'fetch';
  document.head.appendChild(link);
};