const express = require("express");
const router = express.Router();
const sleepLogController = require("../controllers/sleepLog.controller");
const verifyToken = require("../middleware/auth");

router.post("/log", verifyToken, sleepLogController.createOrUpdateLog);
router.get("/log", verifyToken, sleepLogController.getDailyLog);
router.get("/weekly", verifyToken, sleepLogController.getWeeklyStats);

module.exports = router;
