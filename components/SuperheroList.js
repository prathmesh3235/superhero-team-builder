import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuperheroList = () => {
  const [superheroes, setSuperheroes] = useState([]);

  useEffect(() => {
    const fetchSuperheroes = async () => {
      const response = await axios.get('/api/superheroes');
      if (response.data)
        setSuperheroes(response.data);
    };
    fetchSuperheroes();
  }, []);

  return (
    <div>
      <h1>Superheroes</h1>
      <ul>
        {superheroes.map((hero) => (
          <li key={hero.id}>{hero.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SuperheroList;