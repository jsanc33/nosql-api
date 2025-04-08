import express from 'express';
import connectDB from './dbconnection.js';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

await connectDB(); // Ensure the database connection is established before starting the server
const PORT = process.env.PORT || 3001; // Set the port from environment variable or default to 3000
const app = express();
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.json()); // Middleware to parse JSON bodies
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log the server start message with the port number
})
