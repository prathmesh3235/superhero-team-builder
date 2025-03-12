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
        try {
          const response = await axios.get(`/superheroes/${id}`);
          setSuperhero(response.data);
        } catch (error) {
          console.error("Error fetching superhero:", error);
        }
      };

      const checkFavoriteStatus = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsFavorite(
            response.data.some((fav) => fav._id === id || fav.id === id)
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
          { superheroId: id },
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{superhero.name}</h1>
      <button 
        onClick={toggleFavorite}
        className={`px-4 py-2 rounded ${isFavorite ? 'bg-red-500' : 'bg-blue-500'} text-white mb-4`}
      >
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-lg mb-2"><span className="font-semibold">Full Name:</span> {superhero.fullName || 'Unknown'}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Intelligence:</span> {superhero.intelligence}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Strength:</span> {superhero.strength}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Speed:</span> {superhero.speed}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Durability:</span> {superhero.durability}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Power:</span> {superhero.power}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Combat:</span> {superhero.combat}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Alignment:</span> {superhero.alignment}</p>
        </div>
        <div>
          {superhero.image && (
            <Image 
              src={superhero.image} 
              alt={superhero.name} 
              width={400}    
              height={400}   
              objectFit="cover"
              className="rounded shadow-lg" 
            />
          )}
        </div>
      </div>
    </div>
  );
}