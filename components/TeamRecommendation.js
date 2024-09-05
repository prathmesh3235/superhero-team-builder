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

  if (loading) return <div>Loading team recommendation...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Recommended Team</h2>
      <ul>
        {team.map((hero) => (
          <li key={hero.id}>
            <Link href={`/superhero/${hero.id}`}>
              <a>{hero.name} ({hero.alignment})</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamRecommendation;