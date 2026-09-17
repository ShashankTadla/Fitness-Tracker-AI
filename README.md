🏋️‍♂️ Fitness Tracker

A full-stack Health and Fitness Tracker web application to help users monitor and manage their daily fitness goals — including calorie intake, water consumption, sleep tracking, and more.

---

## 🛠 Tech Stack

- **Frontend:** React.js (Port: `3000`)
- **Backend:** Node.js + Express (Port: `5000`)
- **Database:** MySQL (Port: `3306`)

---

## 🔗 System Architecture

```

Database (MySQL) ---> Backend (Express) ---> Frontend (React)
3306                  5000                  3000

````

All frontend requests go through the backend, which fetches or updates data from the MySQL database.

---

## 📦 Features

- ✅ User authentication using JWT
- 🍽 Calorie counter and diet logger
- 💧 Water intake tracker
- 💤 Sleep monitor
- 🏃 Exercise log
- 📊 Reports & progress over time
- 📅 Daily reset logic at midnight
- 🎯 Set and update personal fitness goals
- 🌐 Persistent data storage using MySQL
- 🤖 AI-powered weekly health summaries
- 📜 AI weekly report history

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ShashankTadla/Fitness-Tracker-AI.git  
cd Fitness-Tracker
````
---

### 2. Install Dependencies

```bash
cd backend
npm i

cd ../frontend
npm i
```

### 3. Setting up the Database

Make sure MySQL is running on your system.
Import the schema from `backend/sql/` into your local MySQL server.
Update database credentials in: `backend/config/db.js`

### 4. Run the Project

#### Start Backend

```bash
cd backend
nodemon index.js
```

#### Start Frontend

```bash
cd ../frontend
npm start
```

---

## 🕒 Auto Reset at Midnight

A background timer automatically resets daily logs (like calories, water, etc.) at midnight using a `setTimeout` and `setInterval` logic.

---

## Deployment
The application is deployed on AWS using the following architecture:

- **Frontend:** Amazon S3 Static Website Hosting
- **Backend:** AWS Elastic Beanstalk
- **Database:** Amazon RDS (MySQL)
- **AI Integration:** Groq API
- **Authentication:** JWT

## 📸 Application Screenshots
![Intro page]<img width="1917" height="1022" alt="Screenshot 2026-09-17 125457" src="https://github.com/user-attachments/assets/90915ddd-26d9-40d8-91c1-b8ef57c4d7d7" />

![Register page]<img width="1917" height="1018" alt="Screenshot 2026-09-17 123635 - Copy" src="https://github.com/user-attachments/assets/28f5f3e5-08d4-429a-89eb-cffa8473b7bd" />
![Login page]<img width="1917" height="1022" alt="Screenshot 2026-09-17 125457" src="https://github.com/user-attachments/assets/90915ddd-26d9-40d8-91c1-b8ef57c4d7d7" />

![Dashboard]<img width="1917" height="1021" alt="Screenshot 2026-09-17 123527 - Copy" src="https://github.com/user-attachments/assets/6ffe2c88-ba1d-4cda-b6c9-886bd86114af" />

![Bmi calculator Page]<img width="1917" height="1020" alt="Screenshot 2026-09-17 123540 - Copy" src="https://github.com/user-attachments/assets/274e329c-766e-4dfa-a319-4cfb48df23ac" />

![User Profile Page]<img width="1917" height="1020" alt="Screenshot 2026-09-17 125635" src="https://github.com/user-attachments/assets/4b55b6ac-7170-4c8a-893f-fbf9cc089587" />

![Water logging page]<img width="1906" height="1002" alt="Screenshot 2026-09-17 123604 - Copy" src="https://github.com/user-attachments/assets/340a1975-192a-439b-bc7d-b2da78fbfc75" />

![Sleep Logging page]<img width="1915" height="1017" alt="Screenshot 2026-09-17 123613 - Copy" src="https://github.com/user-attachments/assets/33a14520-f5f8-4d21-b5a1-4ef2a5a5ac78" />

![Calorie logging page]<img width="1917" height="1018" alt="Screenshot 2026-09-17 123557 - Copy" src="https://github.com/user-attachments/assets/fdc6dade-aaed-4457-b594-840d538979e7" />

![Ai Weekly Health Summary]<img width="1917" height="1018" alt="Screenshot 2026-09-17 123507 - Copy" src="https://github.com/user-attachments/assets/2b4348ae-377f-48f1-a3c1-de5d1b0c1d4f" />

![Weekly Report History]<img width="1917" height="1021" alt="Screenshot 2026-09-17 123517 - Copy" src="https://github.com/user-attachments/assets/b32a21a2-5478-44a8-bdcc-40fe38052706" />

## Testing

Run tests:

```bash
npm test

Generate coverage report:
npm run test:coverage

Current Coverage:
Statements: 80.59%
Branches: 46%
Functions: 79.16%
Lines: 81.29%

# Testing CI 

## 🙌 Contributing

Feel free to fork the repository and submit pull requests to improve features or fix bugs.

---


