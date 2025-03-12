/**
 * This script migrates data from SQLite to MongoDB Atlas
 * 
 * Usage: 
 * MONGODB_URI="your-atlas-connection-string" node scripts/migrate-to-mongodb.js
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Database } = require('sqlite3').verbose();

// MongoDB connection (destination)
// Make sure to provide your Atlas connection string when running the script
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/superhero-app';

console.log(`Using MongoDB connection string: ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')}`);

// Path to SQLite database (source)
const SQLITE_DB_PATH = path.join(__dirname, '..', 'prisma', 'dev.db');

// Define MongoDB schemas
const SuperheroSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullName: { type: String },
  intelligence: { type: Number, required: true },
  strength: { type: Number, required: true },
  speed: { type: Number, required: true },
  durability: { type: Number, required: true },
  power: { type: Number, required: true },
  combat: { type: Number, required: true },
  alignment: { type: String, required: true },
  image: { type: String }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEditor: { type: Boolean, default: false }
});

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  superheroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Superhero', required: true }
});

// Create compound index for favorites
FavoriteSchema.index({ userId: 1, superheroId: 1 }, { unique: true });

// Create models
const Superhero = mongoose.model('Superhero', SuperheroSchema);
const User = mongoose.model('User', UserSchema);
const Favorite = mongoose.model('Favorite', FavoriteSchema);

// Check if SQLite database exists
if (!fs.existsSync(SQLITE_DB_PATH)) {
  console.error(`SQLite database not found at ${SQLITE_DB_PATH}`);
  console.log('You have two options:');
  console.log('1. Create sample data directly in MongoDB');
  console.log('2. Make sure your SQLite database exists at the correct path');
  console.log('Proceeding with option 1: Creating sample data...');
}

// Connect to SQLite database if it exists
let db = null;
if (fs.existsSync(SQLITE_DB_PATH)) {
  db = new Database(SQLITE_DB_PATH, (err) => {
    if (err) {
      console.error('Error connecting to SQLite database:', err);
      console.log('Will create sample data instead');
    } else {
      console.log('Connected to SQLite database');
    }
  });
}

async function migrateSuperheroes() {
  console.log('Migrating superheroes...');
  
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Superhero', async (err, superheroes) => {
      if (err) {
        console.error('Error fetching superheroes from SQLite:', err);
        return reject(err);
      }
      
      // ID mapping to convert SQLite IDs to MongoDB ObjectIDs
      const superheroIdMap = {};
      
      // Insert all superheroes into MongoDB
      for (const hero of superheroes) {
        const newHero = new Superhero({
          name: hero.name,
          fullName: hero.fullName,
          intelligence: hero.intelligence,
          strength: hero.strength,
          speed: hero.speed,
          durability: hero.durability,
          power: hero.power,
          combat: hero.combat,
          alignment: hero.alignment,
          image: hero.image
        });
        
        try {
          const savedHero = await newHero.save();
          superheroIdMap[hero.id] = savedHero._id;
          console.log(`Migrated superhero: ${hero.name}`);
        } catch (error) {
          console.error(`Error saving superhero ${hero.name}:`, error);
        }
      }
      
      resolve(superheroIdMap);
    });
  });
}

async function migrateUsers() {
  console.log('Migrating users...');
  
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM User', async (err, users) => {
      if (err) {
        console.error('Error fetching users from SQLite:', err);
        return reject(err);
      }
      
      // ID mapping to convert SQLite IDs to MongoDB ObjectIDs
      const userIdMap = {};
      
      // Insert all users into MongoDB
      for (const user of users) {
        const newUser = new User({
          username: user.username,
          password: user.password, // Already hashed in SQLite
          isEditor: user.isEditor
        });
        
        try {
          const savedUser = await newUser.save();
          userIdMap[user.id] = savedUser._id;
          console.log(`Migrated user: ${user.username}`);
        } catch (error) {
          console.error(`Error saving user ${user.username}:`, error);
        }
      }
      
      resolve(userIdMap);
    });
  });
}

async function migrateFavorites(userIdMap, superheroIdMap) {
  console.log('Migrating favorites...');
  
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Favorite', async (err, favorites) => {
      if (err) {
        console.error('Error fetching favorites from SQLite:', err);
        return reject(err);
      }
      
      // Insert all favorites into MongoDB
      for (const fav of favorites) {
        // Map the SQLite IDs to MongoDB ObjectIDs
        const mongoUserId = userIdMap[fav.userId];
        const mongoSuperheroId = superheroIdMap[fav.superheroId];
        
        if (!mongoUserId || !mongoSuperheroId) {
          console.error(`Could not map favorite: userId=${fav.userId}, superheroId=${fav.superheroId}`);
          continue;
        }
        
        const newFavorite = new Favorite({
          userId: mongoUserId,
          superheroId: mongoSuperheroId
        });
        
        try {
          await newFavorite.save();
          console.log(`Migrated favorite: userId=${fav.userId}, superheroId=${fav.superheroId}`);
        } catch (error) {
          console.error(`Error saving favorite: userId=${fav.userId}, superheroId=${fav.superheroId}`, error);
        }
      }
      
      resolve();
    });
  });
}

async function createSampleData() {
  console.log('Creating sample data in MongoDB...');
  
  // Create sample superheroes
  const sampleHeroes = [
    {
      name: "Superman",
      fullName: "Clark Kent",
      intelligence: 100,
      strength: 100,
      speed: 95,
      durability: 95,
      power: 95,
      combat: 85,
      alignment: "good",
      image: "https://www.superherodb.com/pictures2/portraits/10/100/791.jpg"
    },
    {
      name: "Batman",
      fullName: "Bruce Wayne",
      intelligence: 100,
      strength: 26,
      speed: 27,
      durability: 50,
      power: 47,
      combat: 100,
      alignment: "good",
      image: "https://www.superherodb.com/pictures2/portraits/10/100/639.jpg"
    },
    {
      name: "Joker",
      fullName: "Unknown",
      intelligence: 100,
      strength: 10,
      speed: 12,
      durability: 56,
      power: 22,
      combat: 90,
      alignment: "bad",
      image: "https://www.superherodb.com/pictures2/portraits/10/100/719.jpg"
    },
    {
      name: "Wonder Woman",
      fullName: "Diana Prince",
      intelligence: 88,
      strength: 100,
      speed: 79,
      durability: 100,
      power: 100,
      combat: 100,
      alignment: "good",
      image: "https://www.superherodb.com/pictures2/portraits/10/100/807.jpg"
    },
    {
      name: "Iron Man",
      fullName: "Tony Stark",
      intelligence: 100,
      strength: 85,
      speed: 70,
      durability: 85,
      power: 100,
      combat: 64,
      alignment: "good",
      image: "https://www.superherodb.com/pictures2/portraits/10/100/85.jpg"
    },
    {
      name: "Thanos",
      fullName: "Thanos",
      intelligence: 100,
      strength: 100,
      speed: 33,
      durability: 100,
      power: 100,
      combat: 80,
      alignment: "bad",
      image: "https://www.superherodb.com/pictures2/portraits/10/100/1305.jpg"
    }
  ];
  
  const heroIdMap = {};
  for (const heroData of sampleHeroes) {
    const hero = new Superhero(heroData);
    const savedHero = await hero.save();
    heroIdMap[heroData.name] = savedHero._id;
    console.log(`Created sample superhero: ${heroData.name}`);
  }
  
  // Create sample user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = new User({
    username: 'admin',
    password: hashedPassword,
    isEditor: true
  });
  
  const savedUser = await user.save();
  console.log(`Created sample user: ${user.username}`);
  
  // Create sample favorites
  await Favorite.create({
    userId: savedUser._id,
    superheroId: heroIdMap["Superman"]
  });
  
  await Favorite.create({
    userId: savedUser._id,
    superheroId: heroIdMap["Batman"]
  });
  
  console.log('Sample data created successfully!');
}

async function migrate() {
  console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')}`);
  
  try {
    // Connect to MongoDB with explicit options
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log('Successfully connected to MongoDB');
    
    // Check if we have access to the SQLite database
    if (!db) {
      console.log('SQLite database not accessible. Creating sample data instead...');
      await createSampleData();
    } else {
      // Migrate data from SQLite to MongoDB
      try {
        const superheroIdMap = await migrateSuperheroes();
        const userIdMap = await migrateUsers();
        await migrateFavorites(userIdMap, superheroIdMap);
        console.log('Migration from SQLite completed successfully!');
      } catch (sqliteError) {
        console.error('Error during SQLite migration:', sqliteError);
        console.log('Falling back to creating sample data...');
        await createSampleData();
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your MongoDB Atlas username and password are correct');
    console.log('2. Verify your network allows outbound connections to MongoDB Atlas');
    console.log('3. Check if your IP address is whitelisted in MongoDB Atlas Network Access');
    console.log('4. Run with your explicit connection string:');
    console.log('   MONGODB_URI="mongodb+srv://username:password@your-cluster.mongodb.net/superhero-app" node scripts/migrate-to-mongodb.js');
  } finally {
    // Close connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (db) {
      db.close();
    }
    console.log('Connections closed');
  }
}

// Run the migration
migrate();