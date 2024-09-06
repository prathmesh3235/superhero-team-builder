import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch favorites');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <div>Loading favorites...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Favorite Superheroes</h2>
      {favorites.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.id}>
              <Link href={`/superhero/${favorite.superhero.id}`}>
                <div>{favorite.superhero.name}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesList;