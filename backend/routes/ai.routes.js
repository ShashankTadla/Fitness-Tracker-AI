const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const aiController = require("../controllers/ai.controller");

router.get("/weekly-summary", verifyToken, aiController.getWeeklySummary);

module.exports = router;
