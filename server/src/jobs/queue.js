const { Queue } = require("bullmq");
const connection = require("../config/redis");

const jobQueue = new Queue("job-import-queue", {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = jobQueue;
