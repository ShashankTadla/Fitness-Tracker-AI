require("dotenv").config();

const app = require("./app");
const db = require("./models");

const PORT = process.env.PORT || 5000;

db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connection established successfully.");
    return db.sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });