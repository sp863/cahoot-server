const express = require("express");
const router = express.Router();
const authController = require("./controllers/auth.controller");

router.post("/new", authController.createUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/refresh", authController.handleRefreshToken);

module.exports = router;
