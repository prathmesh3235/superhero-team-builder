import connectToDatabase from '../../../utils/db';
import { Superhero } from '../../../models';

export default async function handler(req, res) {
  await connectToDatabase();
  
  try {
    // MongoDB's $sample operator is equivalent to ORDER BY RANDOM() in SQL
    const randomSuperheroes = await Superhero.aggregate([
      { $sample: { size: 6 } }
    ]);
    
    res.status(200).json(randomSuperheroes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random superheroes', error: error.toString() });
  }
}