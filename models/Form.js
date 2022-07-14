const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    belongsToProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    pdfFileKey: {
      type: String,
      required: true,
    },
    formImageKeys: [
      {
        type: String,
        required: true,
      },
    ],
    requiredSignatures: {
      type: Number,
      default: 0,
      required: true,
    },
    signed: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Form", FormSchema);
