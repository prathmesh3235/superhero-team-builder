import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const superheroes = await prisma.superhero.findMany()
    res.status(200).json(superheroes)
  } else if (req.method === 'POST') {
    const superhero = await prisma.superhero.create({
      data: req.body,
    })
    res.status(201).json(superhero)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}