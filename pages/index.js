import React, { useState, useEffect } from "react";
import SuperheroList from "../components/SuperheroList";
import TeamRecommendation from "../components/TeamRecommendation";
import FavoritesList from "../components/FavoritesList";
import Navbar from "../components/Navbar";
import "../src/app/globals.css";
import Footer from "../components/Footer";
import { FavoritesProvider } from "../context/FavoritesContext";
import { useRouter } from "next/router";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (!token) {
      router.push("/login"); // Redirect to login page if no token found
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-gray-900 text-white relative scroll-smooth">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-5xl font-bold text-center my-5 py-10 text-gray-200 tracking-wide">
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
        <Footer />
      </div>
    </FavoritesProvider>
  );
}
