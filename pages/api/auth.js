import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, action } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      if (action === 'register') {
        // Check if the username already exists before attempting to create
        const existingUser = await prisma.user.findUnique({
          where: { username },
        });

        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }

        // If the username does not exist, proceed with registration
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: { username, password: hashedPassword },
        });
        return res.status(201).json({ message: 'User created successfully' });

      } else if (action === 'login') {
        const user = await prisma.user.findUnique({ where: { username } });

        if (user && await bcrypt.compare(password, user.password)) {
          const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
          return res.status(200).json({ token });
        } else {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
