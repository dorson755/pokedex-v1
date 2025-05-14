import axios from 'axios';

export const pokeAPI = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 10000,
});

export const getPokemon = async (identifier) => {
  try {
    const { data } = await pokeAPI.get(`pokemon/${identifier}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.status === 404 
        ? 'Pokémon not found' 
        : 'Failed to fetch Pokémon data'
    );
  }
};