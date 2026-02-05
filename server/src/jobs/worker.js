require("dotenv").config();
const { Worker } = require("bullmq");
const connection = require("../config/redis");
const Job = require("../models/Job");
const ImportLog = require("../models/ImportLog");
const connectDB = require("../config/db");

(async () => {
  await connectDB();

  new Worker(
    "job-import-queue",
    async (job) => {
      const { data, importLogId } = job.data;

      if (typeof data.externalId !== "string" || !data.externalId.trim()) {
        throw new Error("Invalid externalId type");
      }

      console.log("Processing job:", data.externalId);

      const result = await Job.updateOne(
        { externalId: data.externalId, source: data.source },
        { $set: data },
        { upsert: true },
      );

      const isNew = result.upsertedCount === 1;

      await ImportLog.findByIdAndUpdate(importLogId, {
        $inc: {
          totalImported: 1,
          newJobs: isNew ? 1 : 0,
          updatedJobs: isNew ? 0 : 1,
        },
      });
    },
    {
      connection,
      concurrency: 5,
    },
  );

  console.log("Worker started");
})();
