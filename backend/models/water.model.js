module.exports = (sequelize, DataTypes) => {
  const WaterLog = sequelize.define("water_log", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    waterIntake: {
      type: DataTypes.FLOAT
    }
  });

  return WaterLog;
};
