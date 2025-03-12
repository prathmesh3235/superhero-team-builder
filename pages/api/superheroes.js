import connectToDatabase from '../../utils/db';
import { Superhero } from '../../models';

export default async function handler(req, res) {
  await connectToDatabase();
  
  if (req.method === 'GET') {
    try {
      const superheroes = await Superhero.find({});
      res.status(200).json(superheroes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching superheroes', error: error.toString() });
    }
  } else if (req.method === 'POST') {
    try {
      const superhero = await Superhero.create(req.body);
      res.status(201).json(superhero);
    } catch (error) {
      res.status(500).json({ message: 'Error creating superhero', error: error.toString() });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}