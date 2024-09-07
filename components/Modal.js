import React, { useState, useEffect } from 'react';
import { IoStarOutline, IoStar } from 'react-icons/io5';

const Modal = ({ hero, onClose, isFavorite, onToggleFavorite }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [notification, setNotification] = useState('');
  const [notificationColor, setNotificationColor] = useState('');

  // Trigger notification with timeout
  const triggerNotification = (message, color) => {
    setNotification(message);
    setNotificationColor(color);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleToggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    onToggleFavorite(newFavoriteStatus);
    triggerNotification(
      newFavoriteStatus ? 'Added to Favorites' : 'Removed from Favorites',
      newFavoriteStatus ? 'text-green-500' : 'text-red-500'
    );
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
