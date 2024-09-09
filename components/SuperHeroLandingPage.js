import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from '../components/AuthForm';
import axios from 'axios';


const SuperHeroLandingPage = ({ onLogin }) => {
  const [hoveredHero, setHoveredHero] = useState(null);
  const [superheroes, setSuperheroes] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const fetchSuperheroes = async () => {
      const response = await axios.get('/api/superheroes');
      if (response.data) {
        setSuperheroes(response.data);
      }
    };
    fetchSuperheroes();
  }, []);


  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-700 scroll-smooth">
      {/* Dynamic spotlight effect
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
      /> */}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.h1
          className="text-6xl font-bold mb-12 text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          The Superhero Universe
        </motion.h1>
        
        <AnimatePresence>
        <div id="login-section">
          <AuthForm onLogin={onLogin}  />
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SuperHeroLandingPage;
