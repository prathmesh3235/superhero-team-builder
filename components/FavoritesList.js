import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Modal from '../components/Modal';

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHero, setSelectedHero] = useState(null);
  const [notification, setNotification] = useState('');
  const [notificationColor, setNotificationColor] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('/api/favorites', { headers });
      const favoriteHeroes = response.data.map(fav => ({
        ...fav.superhero,
        isFavorite: true  // Mark as favorite for UI purposes
      }));
      setFavorites(favoriteHeroes);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch favorites');
      setLoading(false);
    }
  };

  const handleSelectHero = (hero) => {
    setSelectedHero(hero);
  };

  const handleFavoriteToggle = async (hero) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/favorites`;
    const isCurrentlyFavorite = hero.isFavorite;

    if (isCurrentlyFavorite) {
      try {
        await axios.delete(`${url}?superheroId=${hero.id}`, { headers });
        setFavorites(prev => prev.filter(h => h.id !== hero.id)); // Optimistically remove the hero
        setNotification('Removed from Favorites');
        setNotificationColor('text-red-500');
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    } else {
      try {
        await axios.post(url, { superheroId: hero.id }, { headers });
        setFavorites(prev => [...prev, {...hero, isFavorite: true}]); // Optimistically add the hero
        setNotification('Added to Favorites');
        setNotificationColor('text-green-500');
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
    setSelectedHero({...hero, isFavorite: !isCurrentlyFavorite}); // Update selectedHero with new favorite status
    setTimeout(() => setNotification(''), 3000);
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
            <div key={favorite.id} className="block bg-gray-800 hover:bg-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer" onClick={() => handleSelectHero(favorite)}>
              <img className="w-full h-48 object-cover" src={favorite.image} alt={favorite.name} />
              <div className="p-4">
                <div className="font-bold text-xl mb-2 text-white">{favorite.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedHero && <Modal hero={selectedHero} onClose={closeModal} isFavorite={selectedHero.isFavorite} onToggleFavorite={() => handleFavoriteToggle(selectedHero)} />}
    </div>
  );
};

export default FavoritesList;
