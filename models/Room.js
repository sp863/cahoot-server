const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    belongsToProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Room", roomSchema);
