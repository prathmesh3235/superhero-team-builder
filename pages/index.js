import { useState, useEffect } from 'react';
import SuperheroList from '../components/SuperheroList';
import AuthForm from '../components/AuthForm';
import TeamRecommendation from '../components/TeamRecommendation';
import FavoritesList from '../components/FavoritesList';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>Superhero Team Builder</h1>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <FavoritesList />
          <TeamRecommendation />
          <SuperheroList />
        </>
      ) : (
        <AuthForm onLogin={handleLogin} />
      )}
    </div>
  );
}