require("dotenv").config();
const { Worker } = require("bullmq");
const redis = require("../config/redis");
const Job = require("../models/Job");
const ImportLog = require("../models/ImportLog");
const connectDB = require("../config/db");

(async () => {
  await connectDB();

  new Worker(
    "job-import-queue",
    async (job) => {
      const { data, importLogId } = job.data;

      try {
        const result = await Job.updateOne(
          { externalId: data.externalId, source: data.source },
          { $set: data },
          { upsert: true },
        );

        if (!result.acknowledged) {
          throw new Error("MongoDB upsert failed");
        }

        const isNew = result.upsertedCount === 1;

        await ImportLog.findByIdAndUpdate(importLogId, {
          $inc: {
            totalImported: 1,
            newJobs: isNew ? 1 : 0,
            updatedJobs: isNew ? 0 : 1,
          },
        });
      } catch (error) {
        await ImportLog.findByIdAndUpdate(importLogId, {
          $push: {
            failedJobs: { jobId: data.externalId, reason: error.message },
          },
        });

        throw error;
      }
    },
    {
      connection: redis,
      concurrency: 5,
    },
  );

  console.log("Worker started");
})();
