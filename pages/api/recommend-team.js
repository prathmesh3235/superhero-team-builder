import connectToDatabase from "../../utils/db";
import { Superhero } from "../../models";

export default async function handler(req, res) {
  await connectToDatabase();
  
  if (req.method === "GET") {
    try {
      const allSuperheroes = await Superhero.find({});

      // Simple recommendation: balance of alignments and high total stats
      const team = recommendTeam(allSuperheroes);

      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ message: "Error recommending team", error: error.toString() });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

function recommendTeam(superheroes) {
  const heroes = superheroes.filter((s) => s.alignment === "good");
  const villains = superheroes.filter((s) => s.alignment === "bad");
  const neutrals = superheroes.filter((s) => s.alignment === "neutral");

  const team = [
    ...selectTop(heroes, 2),
    ...selectTop(villains, 2),
    ...selectTop(neutrals, 1),
  ];

  return team;
}

function selectTop(characters, count) {
  return characters
    .sort((a, b) => getTotalStats(b) - getTotalStats(a))
    .slice(0, count);
}

function getTotalStats(character) {
  return (
    character.intelligence +
    character.strength +
    character.speed +
    character.durability +
    character.power +
    character.combat
  );
}