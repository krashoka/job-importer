const cron = require("node-cron");
const fetchFeed = require("../services/feedFetcher");
const jobQueue = require("../jobs/queue");
const ImportLog = require("../models/ImportLog");

const FEED_URL = "https://jobicy.com/?feed=job_feed";

cron.schedule("0 * * * *", async () => {
  const log = await ImportLog.create({
    fileName: FEED_URL,
    totalFetched: 0,
    totalImported: 0,
    newJobs: 0,
    updatedJobs: 0,
    failedJobs: []
  });

  const feed = await fetchFeed(FEED_URL);
  const jobs = feed.rss.channel.item || [];

  for (const job of jobs) {
    await jobQueue.add("import", {
      data: {
        externalId: job.guid,
        source: FEED_URL,
        title: job.title,
        company: job["job:company"]
      },
      importLogId: log._id
    });
  }

  await ImportLog.findByIdAndUpdate(log._id, {
    totalFetched: jobs.length
  });

  console.log("Import cron executed");
});
