import connectToDatabase from "../../utils/db";
import { Favorite, Superhero } from "../../models";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(req, res) {
  await connectToDatabase();
  
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token required" });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    if (req.method === "POST") {
      const { superheroId } = req.body;
      if (!superheroId)
        return res.status(400).json({ message: "Superhero ID is required" });
      
      // Validate the superhero ID
      if (!mongoose.Types.ObjectId.isValid(superheroId)) {
        return res.status(400).json({ message: "Invalid Superhero ID format" });
      }

      // Check if the superhero exists
      const superhero = await Superhero.findById(superheroId);
      if (!superhero) {
        return res.status(404).json({ message: "Superhero not found" });
      }

      try {
        const favorite = await Favorite.create({ 
          userId, 
          superheroId 
        });
        res.status(201).json(favorite);
      } catch (error) {
        // Handle duplicate key error (user already has this favorite)
        if (error.code === 11000) {
          return res.status(400).json({ message: "This superhero is already in your favorites" });
        }
        throw error;
      }
    } else if (req.method === "GET") {
      const favorites = await Favorite.find({ userId })
        .populate('superheroId');
      
      // Transform the data to match your frontend expectations
      const transformedFavorites = favorites.map(fav => ({
        ...fav.superheroId.toObject(),
        id: fav.superheroId._id,
        _id: fav.superheroId._id
      }));
      
      res.status(200).json(transformedFavorites);
    } else if (req.method === "DELETE") {
      const { superheroId } = req.query;
      if (!superheroId)
        return res.status(400).json({ message: "Superhero ID is required" });
      
      // Validate the superhero ID
      if (!mongoose.Types.ObjectId.isValid(superheroId)) {
        return res.status(400).json({ message: "Invalid Superhero ID format" });
      }

      await Favorite.deleteOne({
        userId,
        superheroId
      });
      
      res.status(200).json({ message: "Favorite removed" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Database or server error:", error);
    res.status(500).json({ message: "Internal server error", error: error.toString() });
  }
}