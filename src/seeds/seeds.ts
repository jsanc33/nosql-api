import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Thought from '../models/Thought.js';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Read JSON files
const usersData = JSON.parse(readFileSync(path.join(__dirname, './users.json'), 'utf-8'));
const thoughtsData = JSON.parse(readFileSync(path.join(__dirname, './thoughts.json'), 'utf-8'));
const reactionsData = JSON.parse(readFileSync(path.join(__dirname, './reactions.json'), 'utf-8'));

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/starwarsDB');

    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});

    console.log('🌌 Old data purged');

    // Insert users
    const createdUsers = await User.insertMany(usersData);
    console.log(`✅ Inserted ${createdUsers.length} users`);

    // Map of usernames to _ids for linking
    const userMap = createdUsers.reduce((acc: Record<string, any>, user) => {
      acc[user.username] = user._id;
      return acc;
    }, {});

    // Assign thoughts to random users
    const thoughtsWithUser = thoughtsData.map(thought => {
      const usernames = Object.keys(userMap);
      const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
      return { ...thought, username: randomUsername };
    });

    const createdThoughts = await Thought.insertMany(thoughtsWithUser);
    console.log(`🧠 Inserted ${createdThoughts.length} thoughts`);

    // Add thought IDs to corresponding users
    for (const thought of createdThoughts) {
      await User.findOneAndUpdate(
        { username: thought.username },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
    }

    // Assign reactions to random thoughts
    for (const reaction of reactionsData) {
      const randomThought = createdThoughts[Math.floor(Math.random() * createdThoughts.length)];
      await Thought.findByIdAndUpdate(
        randomThought._id,
        { $push: { reactions: reaction } },
        { new: true }
      );
    }

    console.log(`💬 Added ${reactionsData.length} reactions`);

    console.log('🌟 Seed complete! May the Force be with your database.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seed();