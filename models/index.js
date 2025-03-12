import mongoose from 'mongoose';

// Superhero Schema
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

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEditor: { type: Boolean, default: false }
});

// Favorite Schema
const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  superheroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Superhero', required: true }
});

// Compound unique index for favorites (no duplicate favorites)
FavoriteSchema.index({ userId: 1, superheroId: 1 }, { unique: true });

// Create models or use existing ones if they've been created
const Superhero = mongoose.models.Superhero || mongoose.model('Superhero', SuperheroSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);

export { Superhero, User, Favorite };