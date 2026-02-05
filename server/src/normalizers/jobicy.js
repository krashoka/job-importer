const normalizeJobicy = (item, source) => {
  return {
    externalId:
      typeof item.guid === "object" ? item.guid._ : item.guid,
    source,
    title: item.title,
    company: item["job:company"] || "Unknown",
    location: item["job:location"] || "Remote",
    url: item.link,
    publishedAt: new Date(item.pubDate),
  };
};

module.exports = normalizeJobicy;
