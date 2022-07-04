const usersRouter = require("../routes/users");

const initiateRouters = (app) => {
  app.use("/api/users", usersRouter);
};

module.exports = initiateRouters;
