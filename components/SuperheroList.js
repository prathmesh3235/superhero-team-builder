import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Modal from './Modal'; 
import Pagination from './Pagination';
import SuperheroCard from './SuperheroCard';

const SuperheroList = () => {
  const [superheroes, setSuperheroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [heroesPerPage] = useState(12); 
  const [selectedHero, setSelectedHero] = useState(null);

  useEffect(() => {
    const fetchSuperheroes = async () => {
      const response = await axios.get('/api/superheroes');
      if (response.data) {
        setSuperheroes(response.data);
        setFilteredHeroes(response.data);
      }
    };
    fetchSuperheroes();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = superheroes.filter(hero => hero.name.toLowerCase().includes(value));
    setFilteredHeroes(filtered);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const indexOfLastHero = currentPage * heroesPerPage;
  const indexOfFirstHero = indexOfLastHero - heroesPerPage;
  const currentHeroes = filteredHeroes.slice(indexOfFirstHero, indexOfLastHero);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const closeModal = () => setSelectedHero(null);

  return (
    <div className="p-8 relative">
      <input
        type="text"
        className="mb-4 p-2 border rounded text-black"
        placeholder="Search heroes..."
        onChange={handleSearch}
      />
      <AnimatePresence>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentHeroes.map((hero) => (
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
      <div className='my-4 flex justify-between items-center'>
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className={`text-white ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:text-gray-300'}`}>
          <IoIosArrowBack size={48} />
        </button>
        <Pagination heroesPerPage={heroesPerPage} totalHeroes={filteredHeroes.length} currentPage={currentPage} paginate={paginate} />
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === Math.ceil(filteredHeroes.length / heroesPerPage)}
          className={`text-white ${currentPage === Math.ceil(filteredHeroes.length / heroesPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-300'}`}>
          <IoIosArrowForward size={48}/>
        </button>
      </div>
      {selectedHero && <Modal hero={selectedHero} onClose={closeModal} />}
    </div>
  );
};

export default SuperheroList;
