import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import Image from "next/image";

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

      fetchSuperhero();
      checkFavoriteStatus();
    }
  }, [id]);

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
      {superhero.image && <Image 
        src={superhero.image} 
        alt={superhero.name} 
        width={400}    
        height={400}   
        objectFit="cover" 
      />}
    </div>
  );
}
