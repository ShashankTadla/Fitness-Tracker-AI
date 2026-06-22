const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, DataTypes);
db.water_log = require("./water.model.js")(sequelize, DataTypes);
db.calorie_log = require("./calorie.model.js")(sequelize, DataTypes);
db.sleep_log = require("./sleep.model.js")(sequelize, DataTypes);
db.weekly_summary = require("./weeklySummary.model.js")(sequelize, DataTypes);

module.exports = db;