import { PrismaClient } from '@prisma/client';



export default async function handler(req, res) {
  const randomSuperheroes = await prisma.$queryRaw`SELECT * FROM Superhero ORDER BY RANDOM() LIMIT 6`;
  res.status(200).json(randomSuperheroes);
}
