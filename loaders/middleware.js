const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const envKeys = require("../config/envConfig");

const initiateMiddlewares = (app) => {
  app.use(
    cors({
      origin: [envKeys.FRONTEND_URL],
      methods: ["GET", "POST", "PATCH", "DELETE"],
    }),
  );

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

module.exports = initiateMiddlewares;
