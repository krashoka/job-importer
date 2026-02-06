const express = require("express");
const ImportLog = require("../models/ImportLog");

const router = express.Router();

/**
 * GET /api/import-logs
 * Query params:
 *   page (default: 1)
 *   limit (default: 10)
 */
router.get("/", async (req, res) => {
  try {
    // Read query params
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1); // limit set to default 10

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetching data
    const [logs, total] = await Promise.all([
      ImportLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ImportLog.countDocuments()
    ]);

    //Paginated response data
    res.json({
      data: logs,
      pagination: {
        totalRecords: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch import logs",
      error: error.message
    });
  }
});

module.exports = router;
