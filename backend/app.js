
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth.routes");
const waterLogRoutes = require("./routes/waterLog.routes");
const calorieLogRoutes = require("./routes/calorieLog.routes");
const sleepLogRoutes = require("./routes/sleepLog.routes");
const aiRoutes = require("./routes/ai.routes");

app.use("/api/auth", authRoutes);
app.use("/api/water", waterLogRoutes);
app.use("/api/calorie", calorieLogRoutes);
app.use("/api/sleep", sleepLogRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Health & Fitness Tracker Backend is running");
});

module.exports = app;
