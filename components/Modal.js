import React, { useState, useEffect } from 'react';
import { IoStarOutline, IoStar } from 'react-icons/io5';
import axios from 'axios';

const Modal = ({ hero, onClose }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [notification, setNotification] = useState('');
  const [notificationColor, setNotificationColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [hero.id]);

  const checkFavorite = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.get(`/api/favorites?superheroId=${hero.id}`, { headers });
      setIsFavorite(response.data.some(fav => fav.superheroId === hero.id));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  // Trigger notification with timeout
  const triggerNotification = (message, color) => {
    setNotification(message);
    setNotificationColor(color);
    setTimeout(() => setNotification(''), 3000);
  };


  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/favorites`;
    const newFavoriteStatus = !isFavorite; // Corrected logic based on the current hero's favorite status

    try {
        if (newFavoriteStatus) {
            // Adding to favorites
            await axios.post(url, { superheroId: hero.id }, { headers });
            setIsFavorite(true); // Update favorite status optimistically
            triggerNotification('Added to Favorites', 'text-green-500');
        } else {
            // Removing from favorites
            await axios.delete(`${url}?superheroId=${hero.id}`, { headers });
            setIsFavorite(false); // Update favorite status optimistically
            triggerNotification('Removed from Favorites', 'text-red-500');
        }
    } catch (error) {
        console.error(newFavoriteStatus ? 'Error adding to favorites:' : 'Error removing from favorites:', error);
        // Optionally handle failed updates, e.g., revert optimistic updates or show error messages
        setIsFavorite(hero.isFavorite); // Revert to original state in case of error
        triggerNotification('Failed to update favorites', 'text-red-500');
    }

    setTimeout(() => setNotification(''), 3000); // Clear notification after a delay
  };

  if (!hero) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl md:max-w-xl w-full">
        <div className="flex flex-col md:flex-row">
          <img src={hero.image} alt={hero.name} className="md:w-1/2 w-full h-auto object-cover rounded" />
          <div className="md:ml-6 mt-4 md:mt-0 md:w-2/3">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4 text-white">{hero.fullName || hero.name}</h2>
              <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className="relative">
                <button 
                  onClick={handleToggleFavorite} 
                  className="text-yellow-400 hover:text-yellow-500 text-3xl"
                >
                  {isFavorite ? <IoStar /> : <IoStarOutline />}
                </button>
                {showTooltip && (
                  <span className="absolute -mt-12 text-center w-32 px-2 py-1 bg-black text-white rounded shadow-lg z-50">
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </span>
                )}
              </div>
            </div>
            {notification && (
              <div className={`text-center py-2 my-2 text-lg ${notificationColor}`}>
                {notification}
              </div>
            )}
            <ul className="list-disc pl-5 text-white space-y-2">
              {['intelligence', 'strength', 'speed', 'durability', 'power', 'combat', 'alignment'].map((attr) => (
                <li key={attr}><strong>{attr.charAt(0).toUpperCase() + attr.slice(1)}:</strong> {hero[attr]}</li>
              ))}
            </ul>
            <button onClick={onClose} className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-300 ease-in-out">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
