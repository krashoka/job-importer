const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true },
    source: { type: String, required: true },
    title: String,
    company: String,
    location: String,
    url: String
  },
  { timestamps: true }
);

JobSchema.index({ externalId: 1, source: 1 }, { unique: true });

module.exports = mongoose.model("Job", JobSchema);
