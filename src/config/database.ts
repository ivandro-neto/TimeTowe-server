import { Sequelize } from 'sequelize'; // Import Sequelize constructor for database interaction
import dotenv from 'dotenv'; // Import dotenv for environment variable management

dotenv.config(); // Load environment variables from .env file into process.env

// Initialize a new Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL||"", {
  dialect: 'postgres', // Specify the database dialect (PostgreSQL in this case)
  logging: false, // Disable logging of SQL queries (set to true to enable)
});

export default sequelize; // Export the Sequelize instance for use in other parts of the application
