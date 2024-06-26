const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      maxlength: [50, "The company name length sould be less than 50"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      maxlength: [100, "The position name length sould be less than 100"],
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "The creator is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
