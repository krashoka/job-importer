const express = require("express");
const ImportLog = require("../models/ImportLog");

const router = express.Router();

router.get("/", async (req, res) => {
  const logs = await ImportLog.find().sort({ createdAt: -1 });
  res.json(logs);
});

module.exports = router;
