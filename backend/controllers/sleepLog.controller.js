const db = require("../models");
const SleepLog = db.sleep_log;

exports.createOrUpdateLog = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { date, sleepHours } = req.body;

    const [log, created] = await SleepLog.findOrCreate({
      where: { userId, date },
      defaults: { sleepHours }
    });

    if (!created) {
      await log.update({ sleepHours });
    }

    res.status(200).json({ message: created ? "Sleep log created" : "Sleep log updated" });
  } catch (err) {
    console.error("❌ Sleep log error:", err);
    res.status(500).json({ message: "Failed to store sleep log", error: err.message });
  }
};

exports.getDailyLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const log = await SleepLog.findOne({ where: { userId, date } });
    res.status(200).json(log || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sleep log", error: err.message });
  }
};

exports.getWeeklyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { endDate } = req.query;

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const logs = await SleepLog.findAll({
      where: {
        userId,
        date: {
          [db.Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch weekly sleep stats", error: err.message });
  }
};
