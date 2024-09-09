import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user.isEditor) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedSuperhero = await prisma.superhero.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(200).json(updatedSuperhero);
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
