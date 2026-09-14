const { Client } = require('pg');
require('dotenv').config();

const setup = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres', // Connect to default DB to create the new one
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DB_NAME}'`);
    
    if (res.rowCount === 0) {
      console.log(`Database ${process.env.DB_NAME} not found, creating it...`);
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}";`);
      console.log(`Database ${process.env.DB_NAME} created successfully.`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err);
  } finally {
    await client.end();
  }
};

setup();
