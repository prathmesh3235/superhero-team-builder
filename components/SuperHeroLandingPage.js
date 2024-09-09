import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from '../components/AuthForm';

const SuperHeroLandingPage = ({ onLogin }) => {
  const [superheroes, setSuperheroes] = useState([]);
  const [hoveredHero, setHoveredHero] = useState(null);
  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-700 scroll-smooth">
      <div className="container mx-auto px-4 py-6 relative z-10">
        <motion.h1
          className="text-6xl font-bold mb-12 text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          The Superhero Universe
        </motion.h1>

        <div className="mb-8 w-full overflow-hidden relative h-60 rounded-lg shadow-lg">
          <img
            src="/bg1.webp"
            alt="Superhero 1"
            className="w-full h-60 object-cover"
          />
        </div>

        <AnimatePresence>
          <div id="login-section">
            <AuthForm/>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SuperHeroLandingPage;
