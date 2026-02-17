module.exports = {
  HOST: "localhost",       // local server
  USER: "root",            // default XAMPP MySQL username
  PASSWORD: "",            // leave empty unless you set a password in XAMPP
  DB: "fitness_tracker",   // name of the database you'll create
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};