import express from 'express';
import User from '../models/User';

const router = express.Router();

// GET leaderboard
// This route retrieves the top 10 users based on their high scores.
router.get('/', async (req, res) => {
  try {
    // Fetch the top users from the database
    const leaderboard = await User.findAll({
      attributes: ['id', 'username', 'highScore'], // Select specific attributes to return
      order: [['highScore', 'DESC']], // Order by high score in descending order
      limit: 10, // Limit the results to the top 10 users
    });

    // Send the leaderboard data as a JSON response
    res.json(leaderboard);
  } catch (error) {
    console.error(error); // Log any errors to the console
    res.status(500).json({ message: 'Internal server error' }); // Respond with a 500 status code on error
  }
});

export default router; // Export the router for use in the main application
