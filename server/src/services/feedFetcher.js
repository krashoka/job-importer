const axios = require("axios");
const parseXML = require("../utils/xmlParser");

const fetchFeed = async (url) => {
  const response = await axios.get(url);
  const parsed = await parseXML(response.data);
  return parsed;
};

module.exports = fetchFeed;
