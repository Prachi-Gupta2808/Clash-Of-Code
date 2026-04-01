# ⚔️ Clash of Code (CoC)

**Clash of Code (CoC)** is a real-time **1v1 competitive coding PvP platform** built using the **MERN stack**, where developers battle live across multiple game modes.  
It combines competitive programming, esports-style matchmaking, win streaks, and Monkeytype-inspired performance analytics.

> Think **Codeforces + LeetCode + real-time duels**.
> > Experience real-time coding battles in action ⚔️

https://github.com/user-attachments/assets/23b9f931-6767-496a-93e3-f5b4cd5e6b70



---

## 🚀 Core Features

### 🎮 Real-Time 1v1 PvP
- Rating-based matchmaking
- Live match updates using WebSockets
- In-match real-time chat
- Instant win/loss resolution

---

### 🧠 Game Modes

#### 1️⃣ Rating Battle Mode
- Players are matched by rating
- A problem of matching difficulty is selected
- Same question for both players
- First correct submission wins

#### 2️⃣ Time & Space Complexity Duel
- Players analyze code snippets
- Answer **time complexity + space complexity**
- First player to get **10 correct answers** wins

#### 3️⃣ Output Prediction Mode
- Players predict output of code snippets
- First player to get **5 correct outputs** wins

---

### 📈 Performance Analytics (Monkeytype-style)
After each match, players receive visual analytics based on:

- ⚡ **Speed** – response/solve time
- 🎯 **Accuracy** – correct answers percentage
- 🧠 **Efficiency** – solution optimality

Graphs include:
- Player vs Opponent (current match)
- Player vs Previous Matches (growth over time)

---

### 🏆 Rating & Strike System
- ELO-based rating system
- 🔥 Win-streak (Strike) system
- Higher streaks yield higher rewards
- Fair rating gain/loss based on opponent rating

---

### 👥 Social Features
- Invite friends via match links
- Player profiles with match history and stats

---

## 🛠 Tech Stack

### Frontend
- **React.js**
- **Monaco Editor** (VS Code editor in browser)
- **Socket.io Client**
- **Chart.js / Recharts** for performance graphs

### Backend
- **Node.js**
- **Express.js**
- **Socket.io** for real-time communication

### Database
- **MongoDB Atlas**
  - Users
  - Matches
  - Ratings
  - Performance analytics
  - Win streaks

### Code Execution
- **Docker**
- Isolated containers for secure code execution

### Hosting & Deployment
- **Dockerized services**
- Deployed using Docker & Docker Compose

---

## 🧠 System Architecture (High Level)

