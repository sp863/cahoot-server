require("dotenv").config();

const envKeys = {
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

module.exports = envKeys;
