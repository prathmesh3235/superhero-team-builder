import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from '../components/AuthForm';
import axios from 'axios';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/bg1.webp',
    '/bg4.webp',
    '/bg2.webp',
    '/bg5.webp'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden relative h-40">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Superhero ${index + 1}`}
            className="w-full h-40 object-cover flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

const SuperHeroLandingPage = ({ onLogin }) => {
  const [superheroes, setSuperheroes] = useState([]);

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
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.h1
          className="text-6xl font-bold mb-12 text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          The Superhero Universe
        </motion.h1>
        
        <div className="mb-8">
          <ImageCarousel />
        </div>

        <AnimatePresence>
          <div id="login-section">
            <AuthForm onLogin={onLogin} />
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SuperHeroLandingPage;