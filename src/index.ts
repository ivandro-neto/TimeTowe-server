import express from 'express'; // Import Express framework
import bodyParser from 'body-parser'; // Middleware to parse request bodies
import cors from 'cors'; // Middleware for enabling CORS (Cross-Origin Resource Sharing)
import sequelize from './config/database'; // Database configuration and connection
import leaderboardRoutes from './routes/leaderboard'; // Import leaderboard routes
import userRoutes from './routes/user'; // Import user routes

const app = express(); // Create an instance of the Express application
const PORT = process.env.PORT || 3000; // Set the port to the environment variable or default to 3000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.use('/api/leaderboard', leaderboardRoutes); // Mount leaderboard routes
app.use('/api/user', userRoutes); // Mount user routes

// Sync database and start server
const startServer = async () => {
  try {
    await sequelize.sync(); // Sync database models with the database
    app.listen(PORT, () => { // Start the server and listen on the specified port
      console.log(`Server is running on port ${PORT}`); // Log the server status
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error); // Log any database connection errors
  }
};

startServer(); // Call the function to start the server
