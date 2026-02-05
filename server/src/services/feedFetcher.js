const axios = require("axios");
const parseXML = require("../utils/xmlParser");
const normalizeJobicy = require("../normalizers/jobicy");
const normalizeHigherEdJobs = require("../normalizers/higherEdJobs");

const FEED_MAP = {
  jobicy: normalizeJobicy,
  highered: normalizeHigherEdJobs
};

const fetchFeed = async (url, type) => {
  const response = await axios.get(url);
  const parsed = await parseXML(response.data);

  const items = parsed.rss.channel.item || [];
  const normalizer = FEED_MAP[type];

  if (!normalizer) {
    throw new Error(`No normalizer found for ${type}`);
  }

  return items.map(item => normalizer(item, url));
};

module.exports = fetchFeed;
