// src/types/express.d.ts
import type{ User } from '../models/User'; // Adjust the import based on your file structure

declare global {
  namespace Express {
    interface Request {
      user?: User; // Or whatever type you have for user
    }
  }
}
