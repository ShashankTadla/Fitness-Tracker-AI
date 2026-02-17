const express = require("express");
const router = express.Router();
const waterLogController = require("../controllers/waterLog.controller");
const verifyToken = require("../middleware/auth");

router.post("/log", verifyToken, waterLogController.createOrUpdateLog);
router.get("/log", verifyToken, waterLogController.getDailyLog);
router.get("/weekly", verifyToken, waterLogController.getWeeklyStats);

module.exports = router;
