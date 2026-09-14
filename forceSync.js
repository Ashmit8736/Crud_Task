const { syncDB } = require('./src/models');
const { connectDB } = require('./src/config/db');
const { sequelize } = require('./src/config/db');

const forceSync = async () => {
  await connectDB();
  console.log('Force syncing database (dropping tables)...');
  await sequelize.sync({ force: true });
  console.log('Database synced with new schema.');
  process.exit();
};

forceSync();
