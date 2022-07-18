const usersRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const projectsRouter = require("../routes/projects");
const formsRouter = require("../routes/forms");
const chatsRouter = require("../routes/chats");
const verifyJWT = require("../routes/middlewares/verifyJWT");

const initiateRouters = (app) => {
  app.use("/api/auth", authRouter);
  app.use(verifyJWT);
  app.use("/api/users", usersRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/chats", chatsRouter);
  app.use("/api/docs", formsRouter);
};

module.exports = initiateRouters;
