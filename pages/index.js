import React, { useState, useEffect } from "react";
import SuperheroLandingPage from "../components/SuperHeroLandingPage";
import SuperheroList from "../components/SuperheroList";
import TeamRecommendation from "../components/TeamRecommendation";
import FavoritesList from "../components/FavoritesList";
import Navbar from "../components/Navbar";
import "../src/app/globals.css";
import AuthForm from "../components/AuthForm";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={() => setShowLogin(true)}
      />
      {showLogin && <AuthForm onLogin={handleLogin} />}{" "}
      {isLoggedIn ? (
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-5xl font-bold text-center my-8 text-gray-200 tracking-wide">
            Welcome to the World of SuperHeroes
          </h1>
          <div className="space-y-8">
            <SuperheroList />
            <FavoritesList />
            <TeamRecommendation />
          </div>
        </div>
      ) : (
        <SuperheroLandingPage onLogin={handleLogin} />
      )}
    </div>
  );
}
