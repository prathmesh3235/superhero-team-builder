import React, { useState, useEffect } from 'react';
import axios from '../axios/axiosInstance';
import Modal from './Modal';
import SuperheroCard from './SuperheroCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';

const FavoritesList = () => {
  const { favorites } = useFavorites();
  const [selectedHero, setSelectedHero] = useState(null);


  const closeModal = () => {
    setSelectedHero(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Your Favorite Superheroes</h2>
      {favorites.length === 0 ? (
        <p className="text-white text-lg">You haven&apos;t added any favorites yet</p>
      ) : (
      <AnimatePresence>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((hero) => (
            <motion.li
              key={hero.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
              onClick={() => setSelectedHero(hero)}
            >
              <SuperheroCard hero={hero}/>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
      )}
      {selectedHero && <Modal hero={selectedHero} onClose={closeModal} />}
    </div>
  );
};

export default FavoritesList;
