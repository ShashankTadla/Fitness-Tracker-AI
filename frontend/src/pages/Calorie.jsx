
import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import "./calorie.css";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import { FaPlus, FaUndo } from "react-icons/fa";
import { logCalorie } from "../services/api";

const defaultFoods = [
  { name: "Chapati", cal: 120, qty: "1 medium" },
  { name: "White Rice", cal: 200, qty: "1 cup" },
  { name: "Dal", cal: 180, qty: "1 cup" },
  { name: "Paneer Curry", cal: 250, qty: "1 serving" },
  { name: "Boiled Egg", cal: 78, qty: "1 egg" },
  { name: "Banana", cal: 105, qty: "1 medium" },
  { name: "Apple", cal: 95, qty: "1 medium" },
  { name: "Upma", cal: 220, qty: "1 bowl" },
  { name: "Dosa", cal: 165, qty: "1 dosa" },
  { name: "Idli", cal: 58, qty: "1 idli" },
  { name: "Curd Rice", cal: 190, qty: "1 cup" },
  { name: "Vegetable Pulao", cal: 215, qty: "1 cup" },
  { name: "Sambar", cal: 100, qty: "1 cup" },
];

const logKey = "calorieLogs";
const goalKey = "calorieGoal";
const dateKey = "calorieDate";

const getToday = () => new Date().toISOString().split("T")[0];

const Calorie = () => {
  const today = getToday();

  const [goal, setGoal] = useState(
    () => parseInt(localStorage.getItem(goalKey), 10) || 2000
  );

  const [inputGoal, setInputGoal] = useState(goal);

  const [logs, setLogs] = useState(() => {
    const savedDate = localStorage.getItem(dateKey);

    if (savedDate !== today) {
      return [];
    }

    try {
      return JSON.parse(localStorage.getItem(logKey)) || [];
    } catch (err) {
      console.error("Failed to read saved calorie logs", err);
      return [];
    }
  });

  const [customFood, setCustomFood] = useState({
    name: "",
    cal: "",
  });

  const consumed = logs.reduce(
    (sum, item) => sum + item.cal,
    0
  );

  const percentage = Math.min(
    (consumed / goal) * 100,
    100
  ).toFixed(0);

  // Sync calories to database
  const syncToDatabase = useCallback(
    async (newLogs, date = getToday()) => {
      const newConsumed = newLogs.reduce(
        (sum, item) => sum + item.cal,
        0
      );

      try {
        await logCalorie({
          date,
          calorieIntake: newConsumed,
        });

        console.log("Calorie log stored in DB");
      } catch (err) {
        console.error(
          "Failed to sync calories:",
          err
        );
      }
    },
    []
  );

  // Save locally and sync with DB
  useEffect(() => {
    localStorage.setItem(
      logKey,
      JSON.stringify(logs)
    );

    localStorage.setItem(goalKey, String(goal));
    localStorage.setItem(dateKey, today);

    syncToDatabase(logs, today);
  }, [logs, goal, today, syncToDatabase]);

  // Reset at midnight
  useEffect(() => {
    const now = new Date();
    const midnight = new Date();

    midnight.setHours(24, 0, 0, 0);

    const msUntilMidnight =
      midnight.getTime() - now.getTime();

    const resetAtMidnight = () => {
      const newDate = getToday();

      setLogs([]);

      localStorage.setItem(
        logKey,
        JSON.stringify([])
      );

      localStorage.setItem(dateKey, newDate);

      syncToDatabase([], newDate);

      console.log("Calorie logs reset at midnight");
    };

    const timeout = setTimeout(
      resetAtMidnight,
      msUntilMidnight
    );

    return () => clearTimeout(timeout);
  }, [syncToDatabase]);

  // Add food
  const handleAdd = (food) => {
    setLogs((previousLogs) => [
      ...previousLogs,
      food,
    ]);
  };

  // Remove last food
  const removeLast = () => {
    setLogs((previousLogs) =>
      previousLogs.slice(0, -1)
    );
  };

  // Update goal
  const handleGoalChange = (e) => {
    setInputGoal(e.target.value);
  };

  const updateGoal = () => {
    const newGoal = Number(inputGoal);

    if (newGoal > 0) {
      setGoal(newGoal);
    }
  };

  // Add custom food
  const handleCustomInput = () => {
    const calories = Number(customFood.cal);

    if (
      customFood.name.trim() &&
      customFood.cal !== "" &&
      Number.isFinite(calories) &&
      calories > 0
    ) {
      const newFood = {
        name: customFood.name.trim(),
        cal: calories,
        qty: "custom",
      };

      handleAdd(newFood);

      setCustomFood({
        name: "",
        cal: "",
      });
    }
  };

  return (
    <div className="water-container">
      <div className="progress-section">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textColor: "#e67e22",
            pathColor: "#f39c12",
            trailColor: "#fdf2e9",
            textSize: "18px",
          })}
        />

        <div className="summary">
          <p>
            <strong>Consumed:</strong> {consumed} kcal
          </p>

          <p>
            <strong>Goal:</strong> {goal} kcal
          </p>

          <p>
            You can eat{" "}
            <strong>
              {Math.max(goal - consumed, 0)} kcal
            </strong>{" "}
            more
          </p>
        </div>
      </div>

      <div className="log-section">
        <h2>Log Calorie Intake</h2>

        <div className="food-list">
          {defaultFoods.map((food, i) => (
            <div
              key={i}
              className="food-card"
              onClick={() => handleAdd(food)}
            >
              <div>
                <p className="food-name">
                  {food.name}
                </p>

                <p className="food-info">
                  {food.cal} kcal, {food.qty}
                </p>
              </div>

              <button>
                <FaPlus />
              </button>
            </div>
          ))}
        </div>

        <div className="custom-food">
          <h3>Custom Food</h3>

          <input
            type="text"
            placeholder="Food name"
            value={customFood.name}
            onChange={(e) =>
              setCustomFood({
                ...customFood,
                name: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Calories"
            value={customFood.cal}
            onChange={(e) =>
              setCustomFood({
                ...customFood,
                cal: e.target.value,
              })
            }
          />

          <button
            className="add"
            onClick={handleCustomInput}
          >
            <FaPlus /> Add Custom
          </button>
        </div>

        <div className="action-buttons">
          <button
            className="add"
            onClick={removeLast}
          >
            <FaUndo /> Remove Last
          </button>
        </div>

        <div className="goal-update">
          <label>Set Goal (kcal):</label>

          <input
            type="number"
            step="10"
            value={inputGoal}
            onChange={handleGoalChange}
          />

          <button onClick={updateGoal}>
            Update
          </button>
        </div>

        <p className="quote">
          🍽 "You are what you eat – choose wisely!"
        </p>
      </div>
    </div>
  );
};

export default Calorie;
