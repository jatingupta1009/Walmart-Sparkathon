const mongoose = require("mongoose");

const familySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    locked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Family", familySchema);
