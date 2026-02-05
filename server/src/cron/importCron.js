const cron = require("node-cron");
const fetchFeed = require("../services/feedFetcher");
const jobQueue = require("../jobs/queue");
const ImportLog = require("../models/ImportLog");

const FEEDS = [
  {
    url: "https://jobicy.com/?feed=job_feed",
    type: "jobicy"
  },
  {
    url: "https://www.higheredjobs.com/rss/articleFeed.cfm",
    type: "highered"
  }
];

cron.schedule("* * * * *", async () => {
  for (const feed of FEEDS) {
    const log = await ImportLog.create({
      fileName: feed.url,
      totalFetched: 0,
      totalImported: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: []
    });

    const jobs = await fetchFeed(feed.url, feed.type);

    for (const job of jobs) {
      await jobQueue.add("import", {
        data: job,
        importLogId: log._id
      });
    }

    await ImportLog.findByIdAndUpdate(log._id, {
      totalFetched: jobs.length
    });

    console.log(`Imported ${jobs.length} jobs from ${feed.url}`);
  }
});
