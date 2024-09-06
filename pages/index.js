import { useState, useEffect } from "react";
import SuperheroList from "../components/SuperheroList";
import AuthForm from "../components/AuthForm";
import TeamRecommendation from "../components/TeamRecommendation";
import FavoritesList from "../components/FavoritesList";
import Image from "next/image";
import "../src/app/globals.css";
import bg2 from "../public/bg3.jpg";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <div className="absolute inset-0">
        <Image
          src={bg2}
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="Superhero background"
          priority
          className="opacity-50"
        />
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-5xl font-bold text-center my-8 text-blue-300 tracking-wide">
          Superhero Team Builder
        </h1>
        {isLoggedIn ? (
          <div className="space-y-8">
            <button
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={handleLogout}
            >
              Logout
            </button>
            <FavoritesList />
            <TeamRecommendation />
            <SuperheroList />
          </div>
        ) : (
          <div className="flex justify-center items-center h-full mt-16">
            <AuthForm onLogin={handleLogin} />
          </div>
        )}
      </div>
    </div>
  );
}