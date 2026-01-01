import sequelize from './db/index.db.js'; // Import the Sequelize instance
import app from './app.js'; // Import app configuration



// Initialize and start the server
const startServer = async () => {
  try {
    await sequelize.sync(); // Sync models with database
    console.log('Models synced successfully');

    const port = process.env.PORT || 5000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('Error during server start:', error);
    process.exit(1);
  }
};

startServer();
