// app.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://fitness-tracker-ai-frontend.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  res.send("Health & Fitness Tracker Backend is running ✅");
});

module.exports = app;