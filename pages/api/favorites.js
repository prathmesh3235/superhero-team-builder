import prisma from "../../utils/prismaClient";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function handler(req, res) {
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
      const favorite = await prisma.favorite.create({
        data: { userId, superheroId },
      });
      res.status(201).json(favorite);
    } else if (req.method === "GET") {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: { superhero: true },
      });
      res.status(200).json(favorites);
    } else if (req.method === "DELETE") {
      const { superheroId } = req.query;
      if (!superheroId)
        return res.status(400).json({ message: "Superhero ID is required" });
      const superheroIdNum = parseInt(superheroId);
      if (isNaN(superheroIdNum))
        return res.status(400).json({ message: "Invalid Superhero ID" });
      await prisma.favorite.deleteMany({
        where: { userId, superheroId: superheroIdNum },
      });
      res.status(200).json({ message: "Favorite removed" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Database or server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
