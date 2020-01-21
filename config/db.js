require("dotenv").config();

import { Client } from "pg";

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: true
});

const dbConnect = async () => {
  try {
    await client.connect();
  } catch (e) {
    console.log(e);
  }
};

dbConnect();

export default client;
