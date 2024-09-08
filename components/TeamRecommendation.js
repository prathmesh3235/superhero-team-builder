import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const TeamRecommendation = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await axios.get('/api/recommend-team');
        setTeam(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch team recommendation');
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  if (loading) return <div className="text-center text-white">Loading team recommendation...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-800 bg-opacity-70 rounded-xl shadow-2xl backdrop-filter backdrop-blur-lg border border-gray-700">
      <h2 className="text-3xl font-bold text-center text-white mb-4">Recommended Team</h2>
      <ul>
        {team.map((hero) => (
          <li key={hero.id} className="my-2">
            <Link href={`/superhero/${hero.id}`}
            className="block p-3 rounded-lg bg-gray-700 bg-opacity-60 hover:bg-opacity-70 transition duration-300 ease-in-out transform hover:scale-105">
                <div className="text-white text-lg font-semibold">
                  {hero.name} <span className="text-sm text-gray-400">({hero.alignment})</span>
                </div>
              
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamRecommendation;
