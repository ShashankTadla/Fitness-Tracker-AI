const express = require("express");
const router = express.Router();
const calorieLogController = require("../controllers/calorieLog.controller");
const verifyToken = require("../middleware/auth");

router.post("/log", verifyToken, calorieLogController.createOrUpdateLog);
router.get("/log", verifyToken, calorieLogController.getDailyLog);
router.get("/weekly", verifyToken, calorieLogController.getWeeklyStats);

module.exports = router;
