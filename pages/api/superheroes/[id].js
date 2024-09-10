import prisma from "../../../utils/prismaClient";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const superhero = await prisma.superhero.findUnique({
      where: { id: parseInt(id) },
    });
    if (superhero) {
      res.status(200).json(superhero);
    } else {
      res.status(404).json({ message: "Superhero not found" });
    }
  } else if (req.method === "PUT") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const user = jwt.decode(token);

      if (!user || !user.isEditor) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { id } = req.query;
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
        (validatedData[key] === undefined || isNaN(validatedData[key])) && delete validatedData[key]
      );

      const updatedSuperhero = await prisma.superhero.update({
        where: { id: parseInt(id, 10) },
        data: validatedData,
      });

      res.status(200).json(updatedSuperhero);
    } catch (error) {
      console.error("Error updating superhero:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
