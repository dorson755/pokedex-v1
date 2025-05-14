import { useState, useEffect } from 'react';
import axios from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function usePokemon() {
  const [state, setState] = useState({
    pokemon: null,
    loading: true,
    error: null,
    retryCount: 0
  });

  const fetchRandomPokemon = async (retryAttempt = 0) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Check network connection first
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }

      const randomId = Math.floor(Math.random() * 600) + 1;
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`, {
        timeout: 5000
      });

      setState({
        pokemon: data,
        loading: false,
        error: null,
        retryCount: 0
      });

    } catch (error) {
      if (retryAttempt < MAX_RETRIES) {
        setTimeout(() => fetchRandomPokemon(retryAttempt + 1), RETRY_DELAY);
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
        retryCount: prev.retryCount + 1
      }));
    }
  };

  const getErrorMessage = (error) => {
    if (error.message.includes('No internet')) {
      return 'Internet connection required';
    }
    if (error.response?.status === 404) {
      return 'Pokémon not found';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out';
    }
    return 'Failed to load Pokémon';
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  return { ...state, fetchRandomPokemon };
}