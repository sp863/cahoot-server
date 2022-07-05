const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstTime: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "default_profile-image.jpeg",
    },
    faceId: [
      {
        type: String,
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
