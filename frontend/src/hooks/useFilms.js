import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFilms = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await axios.get('/submissions');
        setFilms(response.data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des films:', err);
        setError(err);
        // Utiliser des données par défaut en cas d'erreur
        setFilms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  return { films, loading, error };
};
