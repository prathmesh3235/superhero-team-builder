import React, { useState, useEffect } from 'react';
import { IoStarOutline, IoStar } from 'react-icons/io5';
import axios from '../axios/axiosInstance';
import { useFavorites } from '../context/FavoritesContext';

const Modal = ({ hero, onClose }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [notification, setNotification] = useState('');
  const [notificationColor, setNotificationColor] = useState('');
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav.id === hero.id);


  const triggerNotification = (message, color) => {
    setNotification(message);
    setNotificationColor(color);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(hero.id);
        triggerNotification('Removed from Favorites', 'text-red-500');
      } else {
        await addFavorite(hero);
        triggerNotification('Added to Favorites', 'text-green-500');
      }
    } catch (error) {
      triggerNotification('Failed to update favorites', 'text-red-500');
    }
  };

  if (!hero) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-lg ">
        <div className="flex flex-col">
          <img src={hero.image} alt={hero.name} className="w-full h-64 object-cover rounded mb-4" />
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{hero.fullName || hero.name}</h2>
              <div className="relative">
                <button 
                  onClick={handleToggleFavorite} 
                  className="text-yellow-400 hover:text-yellow-500 text-2xl sm:text-3xl"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  {isFavorite ? <IoStar /> : <IoStarOutline />}
                </button>
                {showTooltip && (
                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 px-2 py-1 bg-black text-white text-xs rounded shadow-lg z-50">
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </span>
                )}
              </div>
            </div>
            {notification && (
              <div className={`text-center py-2 my-2 text-sm sm:text-base ${notificationColor}`}>
                {notification}
              </div>
            )}
            <ul className="list-disc pl-5 text-white space-y-1 text-sm sm:text-base mb-4">
              {['intelligence', 'strength', 'speed', 'durability', 'power', 'combat', 'alignment'].map((attr) => (
                <li key={attr}><strong>{attr.charAt(0).toUpperCase() + attr.slice(1)}:</strong> {hero[attr]}</li>
              ))}
            </ul>
            <button onClick={onClose} className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-300 ease-in-out">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;