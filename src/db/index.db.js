// src/db/index.db.js
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config({
  path: '../.env',
});

// db connectr
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',  // Default to localhost if DB_HOST is not set
  username: process.env.DATABASE_USER || 'root',   // Default to 'root' user
  password: process.env.DATABASE_PASSWORD || '',   // Default to empty password
  database: process.env.DATABASE_NAME || 'your_database_name', // Set the database name here
  logging: true, // You can enable logging for debugging purposes (set to true if needed)
});

//console.log(process.env.DATABASE_USER);
// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

export default sequelize;
