import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bg2 from '../public/bg2.jpg';
import AuthForm from '../components/AuthForm';

const SuperHeroLandingPage = ({ onLogin }) => {
  const [hoveredHero, setHoveredHero] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showLogin, setShowLogin] = useState(false);

  const heroes = [
    { name: 'Superman', power: 'Flight, Super Strength, Heat Vision' },
    { name: 'Wonder Woman', power: 'Super Strength, Lasso of Truth, Flight' },
    { name: 'Spider-Man', power: 'Wall-Climbing, Web-Slinging, Spider-Sense' },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Dynamic spotlight effect */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-white pointer-events-none"
        style={{
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          mixBlendMode: 'soft-light',
        }}
        variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.15, scale: 1 } }}
        initial="hidden"
        animate="visible"
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.h1
          className="text-6xl font-bold mb-12 text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to the Superhero Universe
        </motion.h1>
        
        <motion.button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLogin(!showLogin)}
        >
          {showLogin ? 'Close Login' : 'Hero Login'}
        </motion.button>

        <AnimatePresence>
          {showLogin && <AuthForm onLogin={onLogin} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SuperHeroLandingPage;
