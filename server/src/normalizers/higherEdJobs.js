const normalizeHigherEdJobs = (item, source) => {
  return {
    externalId: item.guid || item.link,
    source,
    title: item.title,
    company: item["dc:creator"] || "HigherEd",
    location: item["job:location"] || "Unknown",
    url: item.link,
    publishedAt: new Date(item.pubDate)
  };
};

module.exports = normalizeHigherEdJobs;
