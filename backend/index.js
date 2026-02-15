require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models'); // ✅ Make sure this path is correct

const app = express();

// ✅ Middleware setup
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Routes
const authRoutes = require('./routes/auth.routes');
const waterLogRoutes = require('./routes/waterLog.routes');
const calorieLogRoutes = require('./routes/calorieLog.routes');
const sleepLogRoutes = require('./routes/sleepLog.routes');

app.use('/api/auth', authRoutes);
app.use('/api/water', waterLogRoutes);
app.use('/api/calorie', calorieLogRoutes);
app.use('/api/sleep', sleepLogRoutes);

app.get("/", (req, res) => {
  res.send("Health & Fitness Tracker Backend is running ✅");
});

// ✅ Database connection + server start
const PORT = process.env.PORT || 5000;

db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connection established successfully.");
    return db.sequelize.sync(); // Sync all models with DB
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Database connection error:", err);
  });
