require("dotenv").config();

const envKeys = {
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  AWS_BUCKET_ACCESS_KEY: process.env.AWS_BUCKET_ACCESS_KEY,
  AWS_BUCKET_SECRET_KEY: process.env.AWS_BUCKET_SECRET_KEY,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

module.exports = envKeys;
