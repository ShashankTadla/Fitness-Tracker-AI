import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Add Log (Secure)
router.post("/", verifyToken, (req, res) => {
  const userId = req.user.id;

  const { date, calories, water, sleep, workout_minutes } = req.body;

  const query = `
    INSERT INTO daily_logs (user_id, date, calories, water, sleep, workout_minutes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [userId, date, calories, water, sleep, workout_minutes],
    (err, result) => {
      if (err) {
        console.error("Insert Log Error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      res.json({ message: "Log added successfully", result });
    }
  );
});

// ✅ Get Logs (Secure)
router.get("/", verifyToken, (req, res) => {
  const userId = req.user.id;

  const query = `SELECT * FROM daily_logs WHERE user_id = ? ORDER BY date DESC`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Fetch Logs Error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json(results);
  });
});

export default router;
