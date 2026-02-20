import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { API, getWeeklyAISummary } from "../services/api";

const Dashboard = () => {
  const today = new Date();

  const [sleepData, setSleepData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);

  // ✅ AI Summary States
  const [aiSummary, setAiSummary] = useState("");
  const [aiStats, setAiStats] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState("");

  const generateLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const fetchWeeklyStats = async () => {
    const endDate = today.toISOString().split("T")[0];

    const endpoints = [
      { key: "sleep", setter: setSleepData },
      { key: "water", setter: setWaterData },
      { key: "calorie", setter: setCalorieData },
    ];

    const days = generateLast7Days();

    for (let { key, setter } of endpoints) {
      try {
        const res = await API.get(`/${key}/weekly`, {
          params: { endDate },
        });

        const rawData = res.data;

        const mapped = days.map((date) => {
          const log = rawData.find((item) => item.date === date);

          let value = 0;
          if (key === "sleep") value = log?.sleepHours || 0;
          if (key === "water") value = log?.waterIntake || 0;
          if (key === "calorie") value = log?.calorieIntake || 0;

          return { date: date.slice(5), value };
        });

        setter(mapped);
      } catch (err) {
        console.error(`❌ Failed to fetch ${key} stats`, err);
      }
    }
  };

  // ✅ Fetch AI Summary
  const fetchAISummary = async () => {
    try {
      setLoadingAI(true);
      setAiError("");
      setAiSummary("");
      setAiStats(null);

      const res = await getWeeklyAISummary();

      setAiSummary(res.data.summary);
      setAiStats({
        avgWater: res.data.avgWater,
        avgCalories: res.data.avgCalories,
        avgSleep: res.data.avgSleep,
      });
    } catch (err) {
      console.error("❌ AI summary error:", err);
      setAiError(err.response?.data?.message || "AI Summary failed");
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    fetchWeeklyStats();
  }, []);

  const renderCard = (title, data, color) => (
    <div className="chart-card">
      <h3>{title}</h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-main">
        <Sidebar />

        <div className="dashboard-content">
          <h2>Welcome to FitTrack!</h2>
          <p>Select an option from the sidebar to start tracking your health.</p>

          {/* Weekly charts */}
          <div className="charts-section">
            {renderCard("Sleep (hrs)", sleepData, "#9575cd")}
            {renderCard("Water (L)", waterData, "#4fc3f7")}
            {renderCard("Calories", calorieData, "#ff8a65")}
          </div>

          {/* AI Weekly Summary Section */}
          <div className="chart-card" style={{ marginTop: "30px" }}>
            <h3>🤖 AI Weekly Health Summary</h3>

            <button
              onClick={fetchAISummary}
              disabled={loadingAI}
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "10px",
                background: "#2c3e50",
                color: "white",
              }}
            >
              {loadingAI ? "Generating..." : "Generate Weekly Report"}
            </button>

            {aiError && (
              <p style={{ color: "red", marginTop: "10px" }}>
                ❌ {aiError}
              </p>
            )}

            {aiStats && (
              <div style={{ marginTop: "15px" }}>
                <p><strong>Avg Water:</strong> {aiStats.avgWater} L/day</p>
                <p><strong>Avg Calories:</strong> {aiStats.avgCalories} kcal/day</p>
                <p><strong>Avg Sleep:</strong> {aiStats.avgSleep} hrs/day</p>
              </div>
            )}

            {aiSummary && (
              <div
                style={{
                  marginTop: "15px",
                  background: "#f7f7f7",
                  padding: "15px",
                  borderRadius: "10px",
                  whiteSpace: "pre-line",
                }}
              >
                <p>{aiSummary}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;