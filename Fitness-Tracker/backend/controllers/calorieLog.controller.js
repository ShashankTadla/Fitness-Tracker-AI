const db = require("../models");
const CalorieLog = db.calorie_log;

exports.createOrUpdateLog = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { date, calorieIntake } = req.body;

    const [log, created] = await CalorieLog.findOrCreate({
      where: { userId, date },
      defaults: { calorieIntake }
    });

    if (!created) {
      await log.update({ calorieIntake });
    }

    res.status(200).json({ message: created ? "Log created" : "Log updated" });
  } catch (err) {
    console.error("❌ Calorie log error:", err);
    res.status(500).json({ message: "Failed to store calorie log", error: err.message });
  }
};

exports.getDailyLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const log = await CalorieLog.findOne({ where: { userId, date } });
    res.status(200).json(log || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch log", error: err.message });
  }
};

exports.getWeeklyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { endDate } = req.query;

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const logs = await CalorieLog.findAll({
      where: {
        userId,
        date: {
          [db.Sequelize.Op.between]: [startDate, endDate]
        }
      }
    });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch weekly stats", error: err.message });
  }
};
