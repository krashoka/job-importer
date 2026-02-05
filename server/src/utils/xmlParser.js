const xml2js = require("xml2js");

const parser = new xml2js.Parser({ explicitArray: false });

const parseXML = async (xml) => {
  return parser.parseStringPromise(xml);
};

module.exports = parseXML;
