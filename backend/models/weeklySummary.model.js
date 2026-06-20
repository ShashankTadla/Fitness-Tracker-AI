module.exports = (sequelize, DataTypes) => {
  const WeeklySummary = sequelize.define("weekly_summary", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    weekStart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    weekEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    summaryText: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    avgWater: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    avgCalories: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    avgSleep: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  });

  return WeeklySummary;
};
