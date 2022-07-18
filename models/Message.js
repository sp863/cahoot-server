const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sentBy: {
      email: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    message: {
      type: String,
    },
    sent: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
