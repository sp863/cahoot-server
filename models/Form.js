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
    formKey: {
      type: String,
      required: true,
    },
    formImageKeys: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Form", FormSchema);
