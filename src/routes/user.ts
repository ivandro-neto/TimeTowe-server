import express, { Request, Response, NextFunction } from "express";
import User from "../models/User"; // Assuming a User model is available
import bcrypt from "bcrypt"; // For password hashing
import jwt from "jsonwebtoken"; // For JWT authentication

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Secret key for signing JWTs
let _token: string; // Variable to store the JWT token

// Route to register a new user
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body; // Extract username and password from request body

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = await User.create({ username, password: hashedPassword }); // Create a new user in the database
    res.status(201).json({ id: user.id, username: user.username }); // Respond with user ID and username
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" }); // Respond with an error message on failure
  }
});

// Middleware to authenticate the JWT token
const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"]; // Get the authorization header
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token

  if (!token) {
    res.sendStatus(401); // Unauthorized if token is not present
    return;
  }

  // Verify the JWT token
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.sendStatus(403); // Forbidden if token is invalid
      return;
    }
    req.user = user; // Attach the user information to the request
    next(); // Proceed to the next middleware
  });
};

// Route to log in a user with clientRequestId
router.post(
  "/:clientRequestId/login",
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body; // Extract username and password from request body
    const { clientRequestId } = req.params; // Extract clientRequestId from route parameters

    try {
      const user = await User.findOne({ where: { username } }); // Find the user by username
      // Validate the user and password
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }

      // Generate a JWT token including clientRequestId in the payload
      _token = jwt.sign(
        { id: user.id, username: user.username, clientRequestId },
        JWT_SECRET,
        {
          expiresIn: "30d", // Token expires in 30 days
        },
      );

      res.json({ _token }); // Respond with the generated token
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error logging in" }); // Respond with an error message on failure
    }
  },
);

// Route to verify the clientRequestId with the token
router.get(
  "/:clientRequestId/verify",
  (req: Request, res: Response): void => {
    const { clientRequestId } = req.params; // Extract clientRequestId from route parameters
    console.log(`${clientRequestId} made a request.`) // Log the request
    const payload = jwt.decode(_token); // Decode the JWT token

    // Check if the clientRequestId in the token matches the one in the request
    if (clientRequestId === payload.clientRequestId) {
      console.log("ClientRequestId verified successfully.")
      res.status(200).json({ _token }); // Respond with the token if verified
    } else {
      console.log("Invalid ClientRequestId.");
      res.status(403).json({ message: "Invalid ClientRequestId." }); // Respond with forbidden if not matched
    }
  },
);

// Route to get the user profile
router.get(
  "/:token/profile",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = jwt.decode(req.params.token); // Decode the token from the request parameters
      const user = await User.findByPk(payload?.id); // Find the user by ID from the payload
      if (user) {
        res.json({ id: user.id, username: user.username, highScore: user.highScore }); // Respond with user data
      } else {
        res.sendStatus(404); // Respond with not found if user does not exist
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Respond with server error on exception
    }
  },
);

// Route to update the user's high score
router.patch(
  "/:token/highscore",
  // Middleware to verify the token
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params; // Extract token from route parameters
    const { highScore } = req.body; // Extract high score from request body

    try {
      const payload = jwt.decode(token); // Decode the token
      console.log(payload);
      if (!payload) {
        res.status(403).json({ message: "Invalid ClientRequestId." });
        return;
      }

      const user = await User.findByPk(payload?.id); // Find the user by ID from the payload
      if (user) {
        user.highScore = highScore; // Update the highScore
        await user.save(); // Save the changes in the database
        res.status(200).json({ message: "High score updated successfully.", highScore }); // Respond with success message
      } else {
        res.sendStatus(404); // Respond with not found if user does not exist
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Respond with server error on exception
    }
  }
);

export default router; // Export the router for use in other parts of the application
