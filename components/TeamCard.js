import React from 'react';
import { motion } from 'framer-motion';

const TeamCard = ({ team, type, onSelect }) => (
  <motion.div 
    className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-sm mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-xl font-bold text-white mb-2">Team {type}</h3>
    <select 
      className="w-full p-2 bg-gray-700 text-white rounded mb-4"
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Select Team Type</option>
      <option value="balanced">Balanced</option>
      <option value="strength">Strength-based</option>
      <option value="intelligence">Intelligence-based</option>
      <option value="random">Random</option>
    </select>
    {team.map((hero, index) => (
      <motion.div 
        key={hero.id} 
        className="bg-gray-700 p-2 rounded mb-2 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className={`w-8 h-8 rounded-full mr-2 flex-shrink-0 flex items-center justify-center ${
          hero.alignment === 'good' ? 'bg-green-500' : 
          hero.alignment === 'bad' ? 'bg-red-500' : 'bg-yellow-500'
        }`}>
          {hero.name.charAt(0)}
        </div>
        <span className="text-white text-sm sm:text-base truncate flex-grow">{hero.name}</span>
        <span className="text-gray-400 text-xs sm:text-sm ml-2">{hero.alignment}</span>
      </motion.div>
    ))}
  </motion.div>
);

export default TeamCard;