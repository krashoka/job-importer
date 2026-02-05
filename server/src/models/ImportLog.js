const mongoose = require("mongoose");

const ImportLogSchema = new mongoose.Schema(
  {
    fileName: String,
    totalFetched: Number,
    totalImported: Number,
    newJobs: Number,
    updatedJobs: Number,
    failedJobs: [
      {
        jobId: String,
        reason: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImportLog", ImportLogSchema);
