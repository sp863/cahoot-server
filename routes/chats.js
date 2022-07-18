const express = require("express");
const router = express.Router();
const chatController = require("./controllers/chat.controller");

router.post("/rooms/new", chatController.createRoom);
router.get("/rooms", chatController.getRoomsByUsers);
router.get("/rooms/:room_id", chatController.getRoom);
router.get("/messages/:message_id", chatController.translateMessage);

module.exports = router;
