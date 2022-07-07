const usersRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const verifyJWT = require("../routes/middlewares/verifyJWT");

const initiateRouters = (app) => {
  app.use("/api/auth", authRouter);
  app.use(verifyJWT);
  app.use("/api/users", usersRouter);
};

module.exports = initiateRouters;
