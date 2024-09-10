import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoStarOutline, IoStar } from "react-icons/io5";
import { useFavorites } from "../context/FavoritesContext";
import axios from "../utils/axiosInstance";

const Modal = ({ hero, onClose, isAdmin }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationColor, setNotificationColor] = useState("");
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some((fav) => fav.id === hero.id);
  const [editMode, setEditMode] = useState(false);
  const [editedHero, setEditedHero] = useState(hero);

  const triggerNotification = (message, color) => {
    setNotification(message);
    setNotificationColor(color);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(hero.id);
        triggerNotification("Removed from Favorites", "text-red-500");
      } else {
        await addFavorite(hero);
        triggerNotification("Added to Favorites", "text-green-500");
      }
    } catch (error) {
      triggerNotification("Failed to update favorites", "text-red-500");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
    
    setEditedHero(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseInt(value, 10) || 0 : value
    }));
  };


  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/superheroes/${hero.id}`, editedHero, {
        headers: { Authorization: `Bearer ${token}` },
      });
      triggerNotification("Superhero updated successfully", "text-green-500");
      setEditMode(false);
    } catch (error) {
      triggerNotification("Failed to update superhero", "text-red-500");
    }
  };

  if (!hero) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <div className="flex flex-col">
          <Image
            src={hero.image}
            alt={hero.name}
            width={400}
            height={256}
            className="w-full h-64 object-cover rounded mb-4"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-4">
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={editedHero.name}
                  onChange={handleInputChange}
                  className="text-xl sm:text-2xl font-bold text-white bg-gray-700 rounded px-2 py-1"
                />
              ) : (
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {hero.fullName || hero.name}
                </h2>
              )}
              <div className="flex items-center">
                {isAdmin && (
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    {editMode ? "Cancel" : "Edit"}
                  </button>
                )}
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
            </div>
            {notification && (
              <div
                className={`text-center py-2 my-2 text-sm sm:text-base ${notificationColor}`}
              >
                {notification}
              </div>
            )}
            <ul className="list-disc pl-5 text-white space-y-1 text-sm sm:text-base mb-4">
              {[
                "intelligence",
                "strength",
                "speed",
                "durability",
                "power",
                "combat",
                "alignment",
              ].map((attr) => (
                <li key={attr}>
                  <strong>
                    {attr.charAt(0).toUpperCase() + attr.slice(1)}:
                  </strong>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      name={attr}
                      value={editedHero[attr]}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 ml-2"
                    />
                  ) : (
                    hero[attr]
                  )}
                </li>
              ))}
            </ul>
            {editMode ? (
              <button
                onClick={handleSave}
                className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition-colors duration-300 ease-in-out mb-2"
              >
                Save Changes
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;