import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';

// Define the User model
class User extends Model {
  public id!: number;               // User's unique identifier
  public username!: string;         // User's username
  public password!: string;         // User's password (hashed)
  public highScore!: number;        // User's high score in the game

  // Method to check if the provided password is valid
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password); // Compare the hashed password with the provided password
  }
}

// Initialize the User model with its attributes and settings
User.init(
  {
    id: {
      type: DataTypes.INTEGER,    // Data type for the ID
      autoIncrement: true,        // Automatically increment the ID
      primaryKey: true,           // This field is the primary key
    },
    username: {
      type: DataTypes.STRING,     // Data type for the username
      allowNull: false,           // The username cannot be null
      unique: true,               // The username must be unique across all users
    },
    highScore: {
      type: DataTypes.INTEGER,     // Data type for the high score
      allowNull: false,            // The high score cannot be null
      unique: false,               // High scores can be the same for different users
      defaultValue: 0              // Default value for high score is 0
    },
    password: {
      type: DataTypes.STRING,      // Data type for the password
      allowNull: false,            // The password cannot be null
    },
  },
  {
    sequelize,                    // The Sequelize instance
    modelName: 'User',           // Name of the model in the database
  }
);

export default User;  // Export the User model for use in other parts of the application
