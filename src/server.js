const app = require('./app');
const { connectDB } = require('./config/db');
const { syncDB } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();
  
  // Sync Models
  await syncDB();

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
