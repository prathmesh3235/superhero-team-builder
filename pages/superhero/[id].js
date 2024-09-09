import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "../../axios/axiosInstance";

export default function SuperheroDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [superhero, setSuperhero] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchSuperhero = async () => {
        const response = await axios.get(`/superheroes/${id}`);
        setSuperhero(response.data);
      };
      fetchSuperhero();
      checkFavoriteStatus();
    }
  }, [id]);

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorite(
        response.data.some((fav) => fav.superheroId === parseInt(id))
      );
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isFavorite) {
        await axios.delete(`/favorites?superheroId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          "/favorites",
          { superheroId: parseInt(id) },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (!superhero) return <div>Loading...</div>;

  return (
    <div>
      <h1>{superhero.name}</h1>
      <button onClick={toggleFavorite}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
      <p>Full Name: {superhero.fullName}</p>
      <p>Intelligence: {superhero.intelligence}</p>
      <p>Strength: {superhero.strength}</p>
      <p>Speed: {superhero.speed}</p>
      <p>Durability: {superhero.durability}</p>
      <p>Power: {superhero.power}</p>
      <p>Combat: {superhero.combat}</p>
      <p>Alignment: {superhero.alignment}</p>
      {superhero.image && <img src={superhero.image} alt={superhero.name} />}
    </div>
  );
}
