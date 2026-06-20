const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const aiController = require("../controllers/ai.controller");

router.get("/weekly-summary", verifyToken, aiController.getWeeklySummary);

// ✅ NEW route for history
router.get("/history", verifyToken, aiController.getSummaryHistory);

module.exports = router;
