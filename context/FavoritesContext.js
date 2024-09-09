import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../axios/axiosInstance";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get("/favorites", { headers });
      setFavorites(
        response.data.map((fav) => ({ ...fav.superhero, isFavorite: true }))
      );
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const addFavorite = async (hero) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post("/favorites", { superheroId: hero.id }, { headers });
      setFavorites((prevFavorites) => [
        ...prevFavorites,
        { ...hero, isFavorite: true },
      ]);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (heroId) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.delete(`/favorites?superheroId=${heroId}`, { headers });
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.id !== heroId)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, fetchFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
