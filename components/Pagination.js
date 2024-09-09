import React from 'react';

const Pagination = ({ heroesPerPage, totalHeroes, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalHeroes / heroesPerPage);
  return (
    <div className='flex justify-center space-x-2 mt-8'>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <li key={number} className='cursor-pointer text-white'>
          <a onClick={() => paginate(number)}>{number}</a>
        </li>
      ))}
    </div>
  );
};

export default Pagination;
