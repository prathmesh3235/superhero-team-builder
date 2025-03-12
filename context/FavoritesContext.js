import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../utils/axiosInstance";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get("/favorites", { headers });
      
      // Log the response to debug
      console.log('Favorites response:', response.data);
      
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const addFavorite = async (hero) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const headers = { Authorization: `Bearer ${token}` };
    const heroId = hero._id || hero.id;
    
    try {
      await axios.post("/favorites", { superheroId: heroId }, { headers });
      setFavorites((prevFavorites) => [
        ...prevFavorites,
        { 
          ...hero, 
          isFavorite: true,
          // Ensure both id and _id are available for compatibility
          id: hero.id || hero._id,
          _id: hero._id || hero.id
        },
      ]);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (heroId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.delete(`/favorites?superheroId=${heroId}`, { headers });
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => {
          // Filter using both id and _id for compatibility
          const favId = fav._id || fav.id;
          return favId !== heroId;
        })
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