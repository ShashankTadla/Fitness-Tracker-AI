
require("dotenv").config();

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT || 4000),
  dialect: "mysql",

  dialectOptions: {
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true
    }
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
