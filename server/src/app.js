const express = require("express");
const cors = require("cors");
const importLogsRoute = require("./routes/importLogs");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "OK" }));

app.use("/api/import-logs", importLogsRoute);

module.exports = app;
