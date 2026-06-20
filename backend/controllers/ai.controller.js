const db = require("../models");
const axios = require("axios");

const { Op } = db.Sequelize;

const WaterLog = db.water_log;
const CalorieLog = db.calorie_log;
const SleepLog = db.sleep_log;
const WeeklySummary = db.weekly_summary;

exports.getWeeklySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    const weekStart = startDate.toISOString().split("T")[0];
    const weekEnd = endDate.toISOString().split("T")[0];

    // ✅ Step 1: Check if summary already exists in DB
    const existingSummary = await WeeklySummary.findOne({
      where: { userId, weekStart, weekEnd },
    });

    if (existingSummary) {
      console.log("✅ Weekly Summary fetched from DB (cached)");

      return res.status(200).json({
        summary: existingSummary.summaryText,
        avgWater: existingSummary.avgWater.toFixed(2),
        avgCalories: existingSummary.avgCalories.toFixed(2),
        avgSleep: existingSummary.avgSleep.toFixed(2),
        cached: true,
      });
    }

    // ✅ Step 2: Fetch last 7 days logs
    const waterLogs = await WaterLog.findAll({
      where: { userId, date: { [Op.between]: [startDate, endDate] } },
      order: [["date", "ASC"]],
    });

    const calorieLogs = await CalorieLog.findAll({
      where: { userId, date: { [Op.between]: [startDate, endDate] } },
      order: [["date", "ASC"]],
    });

    const sleepLogs = await SleepLog.findAll({
      where: { userId, date: { [Op.between]: [startDate, endDate] } },
      order: [["date", "ASC"]],
    });

    const avgWater =
      waterLogs.reduce((sum, log) => sum + (log.waterIntake || 0), 0) /
      (waterLogs.length || 1);

    const avgCalories =
      calorieLogs.reduce((sum, log) => sum + (log.calorieIntake || 0), 0) /
      (calorieLogs.length || 1);

    const avgSleep =
      sleepLogs.reduce((sum, log) => sum + (log.sleepHours || 0), 0) /
      (sleepLogs.length || 1);

    const prompt = `
You are a professional fitness coach.

Generate a weekly health summary based on last 7 days data.

Water logs: ${JSON.stringify(waterLogs)}
Calorie logs: ${JSON.stringify(calorieLogs)}
Sleep logs: ${JSON.stringify(sleepLogs)}

Averages:
- Avg Water: ${avgWater.toFixed(2)} L/day
- Avg Calories: ${avgCalories.toFixed(2)} kcal/day
- Avg Sleep: ${avgSleep.toFixed(2)} hrs/day

Format output like:

1. Overall Summary (2 lines)
2. Water Analysis
3. Calorie Analysis
4. Sleep Analysis
5. Suggestions (3 bullet points)
6. Motivation line

Keep tone simple and motivational.
`;

    console.log("🤖 Generating new Weekly Summary using Groq...");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const summary = response.data.choices[0].message.content;

    // ✅ Step 3: Save summary in DB
    await WeeklySummary.create({
      userId,
      weekStart,
      weekEnd,
      summaryText: summary,
      avgWater,
      avgCalories,
      avgSleep,
    });

    console.log("💾 Weekly Summary stored in DB");

    res.status(200).json({
      summary,
      avgWater: avgWater.toFixed(2),
      avgCalories: avgCalories.toFixed(2),
      avgSleep: avgSleep.toFixed(2),
      cached: false,
    });
  } catch (err) {
    console.error("❌ Groq Weekly Summary Error:", err.response?.data || err.message);

    res.status(500).json({
      message: "AI summary failed",
      error: err.response?.data || err.message,
    });
  }
};

exports.getSummaryHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const summaries = await WeeklySummary.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(summaries);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch history",
      error: err.message,
    });
  }
};
