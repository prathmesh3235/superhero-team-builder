import React, { useState, useEffect } from "react";
import SuperheroLandingPage from "../components/SuperHeroLandingPage";
import SuperheroList from "../components/SuperheroList";
import TeamRecommendation from "../components/TeamRecommendation";
import FavoritesList from "../components/FavoritesList";
import Navbar from "../components/Navbar";
import "../src/app/globals.css";
import AuthForm from "../components/AuthForm";
import Footer from "../components/Footer";

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
    <div className="min-h-screen bg-gray-900 text-white relative scroll-smooth">
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
            <div id="favorites-section">
              <FavoritesList />
            </div>{" "}
            <div id="TeamBattle-section">
              <TeamRecommendation />
              <div className="max-w-7xl mx-auto h-16 flex justify-center items-center">
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="bg-gray-800 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-1 rounded"
                >
                  Scroll to Top
                </button>
              </div>
            </div>{" "}
          </div>
        </div>
      ) : (
        <SuperheroLandingPage onLogin={handleLogin} />
      )}
      <Footer />
    </div>
  );
}
