import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; // Importing arrow icons for pagination
import { IoStarOutline, IoStar } from 'react-icons/io5';
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
              <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <img className="w-full h-48 object-cover" src={hero.image} alt={hero.name} />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{hero.name}</div>
                </div>
              </div>
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

const Pagination = ({ heroesPerPage, totalHeroes, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalHeroes / heroesPerPage);
  return (
    <div className='flex justify-center space-x-2 mt-8'>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <li key={number} className='cursor-pointer text-blue-500'>
          <a onClick={() => paginate(number)}>{number}</a>
        </li>
      ))}
    </div>
  );
};

const Modal = ({ hero, onClose }) => {
  const [isFavorite, setIsFavorite] = useState(false);  // State to track favorite status

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem('token');
    const url = `/api/favorites`;
    const headers = { Authorization: `Bearer ${token}` };
    if (!isFavorite) {
      try {
        await axios.post(url, { superheroId: hero.id }, { headers });
        setIsFavorite(true);
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    } else {
      try {
        await axios.delete(`${url}?superheroId=${hero.id}`, { headers });
        setIsFavorite(false);
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl md:max-w-xl w-full">
        <div className="flex flex-col md:flex-row">
          <img src={hero.image} alt={hero.name} className="md:w-1/2 w-full h-auto object-cover rounded"/>
          <div className="md:ml-6 mt-4 md:mt-0 md:w-2/3">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{hero.fullName || hero.name}</h2>
              <button onClick={handleFavoriteToggle} className="text-yellow-400 hover:text-yellow-500 text-3xl">
                {isFavorite ? <IoStar /> : <IoStarOutline />}
              </button>
            </div>
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

export default SuperheroList;
