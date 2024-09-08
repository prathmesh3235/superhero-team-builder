import React from 'react';

const SuperheroCard = ({ hero }) => {
  return (
    <div className="superheroCard">
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
        <img className="w-full h-48 object-cover" src={hero.image} alt={hero.name} />
        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{hero.name}</div>
        </div>
        </div>
    </div>
  );
};

export default SuperheroCard;
