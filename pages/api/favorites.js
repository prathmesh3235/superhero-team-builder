// pages/api/favorites.js

import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    if (req.method === 'POST') {
      const { superheroId } = req.body
      const favorite = await prisma.favorite.create({
        data: { userId, superheroId },
      })
      res.status(201).json(favorite)
    } else if (req.method === 'GET') {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: { superhero: true },
      })
      res.status(200).json(favorites)
    } else if (req.method === 'DELETE') {
      const { superheroId } = req.query
      await prisma.favorite.deleteMany({
        where: { userId, superheroId: parseInt(superheroId) },
      })
      res.status(200).json({ message: 'Favorite removed' })
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}