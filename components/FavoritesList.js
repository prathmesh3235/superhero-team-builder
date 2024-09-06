import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Modal from '../components/Modal';

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHero, setSelectedHero] = useState(null);

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

  const handleSelectHero = (hero) => {
    setSelectedHero(hero);
  };

  const closeModal = () => {
    setSelectedHero(null);
  };

  if (loading) return <div className="text-center text-white mt-4">Loading favorites...</div>;
  if (error) return <div className="text-center text-red-500 mt-4">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Your Favorite Superheroes</h2>
      {favorites.length === 0 ? (
        <p className="text-white text-lg">You haven't added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((favorite) => (
            <div key={favorite.superhero.id} className="block bg-gray-800 hover:bg-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer" onClick={() => handleSelectHero(favorite.superhero)}>
              <img className="w-full h-48 object-cover" src={favorite.superhero.image} alt={favorite.superhero.name} />
              <div className="p-4">
                <div className="font-bold text-xl mb-2 text-white">{favorite.superhero.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedHero && <Modal hero={selectedHero} onClose={closeModal} />}
    </div>
  );
};

export default FavoritesList;
