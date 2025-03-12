import connectToDatabase from '../../../utils/db';
import { Superhero } from '../../../models';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;
  
  // Validate ID format for MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid superhero ID format" });
  }

  if (req.method === "GET") {
    try {
      const superhero = await Superhero.findById(id);
      if (superhero) {
        res.status(200).json(superhero);
      } else {
        res.status(404).json({ message: "Superhero not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching superhero", error: error.toString() });
    }
  } else if (req.method === "PUT") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const user = jwt.verify(token, JWT_SECRET);

      if (!user || !user.isEditor) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedData = req.body;

      // Validate and convert incoming data
      const validatedData = {
        name: updatedData.name,
        fullName: updatedData.fullName,
        intelligence: parseInt(updatedData.intelligence, 10),
        strength: parseInt(updatedData.strength, 10),
        speed: parseInt(updatedData.speed, 10),
        durability: parseInt(updatedData.durability, 10),
        power: parseInt(updatedData.power, 10),
        combat: parseInt(updatedData.combat, 10),
        alignment: updatedData.alignment,
        image: updatedData.image,
      };

      // Remove any undefined or NaN values
      Object.keys(validatedData).forEach(key => 
        (validatedData[key] === undefined || isNaN(validatedData[key]) && typeof validatedData[key] === 'number') && delete validatedData[key]
      );

      const updatedSuperhero = await Superhero.findByIdAndUpdate(
        id,
        validatedData,
        { new: true } // Return the updated document
      );

      if (!updatedSuperhero) {
        return res.status(404).json({ message: "Superhero not found" });
      }

      res.status(200).json(updatedSuperhero);
    } catch (error) {
      console.error("Error updating superhero:", error);
      res.status(500).json({ message: "Internal server error", error: error.toString() });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}