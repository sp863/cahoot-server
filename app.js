const express = require("express");
const initiateMiddlewares = require("./loaders/middleware");
const initiateRouters = require("./loaders/router");
const initiateErrorHandler = require("./loaders/errorHandler");
const db = require("./loaders/db");
db.connect();

const app = express();

initiateMiddlewares(app);
initiateRouters(app);
initiateErrorHandler(app);

module.exports = app;
