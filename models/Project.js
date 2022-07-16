const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    projectUrl: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    forms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
