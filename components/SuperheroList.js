import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Modal from './Modal'; // Assuming Modal is now a separate component
import Pagination from './Pagination'; // Assuming Pagination is separated if needed, or kept within this file if not
import SuperheroCard from './SuperheroCard';

const SuperheroList = () => {
  const [superheroes, setSuperheroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [heroesPerPage] = useState(12); // Defines the number of heroes per page
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
      <h1 className="text-2xl font-bold mb-6">Superheroes</h1>
      <input
        type="text"
        className="mb-4 p-2 border rounded"
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
              {/* <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <img className="w-full h-48 object-cover" src={hero.image} alt={hero.name} />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{hero.name}</div>
                </div>
              </div> */}
              <SuperheroCard hero={hero}/>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
      <div className='flex justify-between absolute w-full left-0 px-8 -translate-y-1/2 top-1/2'>
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className={`text-white text-6xl ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:text-gray-300'}`}>
          <IoIosArrowBack size={100} />
        </button>
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === Math.ceil(filteredHeroes.length / heroesPerPage)}
          className={`text-white text-6xl ${currentPage === Math.ceil(filteredHeroes.length / heroesPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-300'}`}>
          <IoIosArrowForward size={100}/>
        </button>
      </div>
      <Pagination heroesPerPage={heroesPerPage} totalHeroes={filteredHeroes.length} currentPage={currentPage} paginate={paginate} />
      {selectedHero && <Modal hero={selectedHero} onClose={closeModal} />}
    </div>
  );
};

export default SuperheroList;
