# 🌿 SEGREGO

> **AI-Powered Smart Waste Segregation & Sustainable Urban Waste Management Platform**

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)](https://vitejs.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black?logo=socket.io)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Overview

**SEGREGO** is a modern full-stack smart city waste management platform designed to solve urban waste segregation at source. It combines **computer vision-based image analysis**, **IoT smart bin telemetry**, **civic complaint triage**, and **gamified citizen rewards** to create an end-to-end circular economy loop between citizens, smart hardware, and municipal authorities.

---

## ✨ Key Features

### 🤖 1. AI-Powered Waste Scanner (`/ai-detect`)
- **Computer Vision Pixel Classifier**: Uses HTML5 Canvas RGB-to-HSV color/texture analysis to identify organic food waste, plastics, paper, glass, metals, and e-waste.
- **10 Waste Categories Supported**: Biodegradable (Wet Waste), Plastic (PET/wrappers), Paper & Cardboard, Glass, Metal, E-Waste, Hazardous (batteries/chemicals), Medical, Textiles, and Non-Recyclable.
- **Automated Bin Recommendation**: Instantly specifies the correct municipal bin color (🟢 Green, 🔵 Blue, 🔴 Red, 🟡 Yellow, ⚪ White, ⚫ Black).
- **Comprehensive Disposal Instructions**: Clear preparation steps (rinsing, flattening, hazard protocols) and ecological impact metrics.
- **Anti-Cheat Validation**: Daily scan allowances, duplicate image prevention, and verified point awards.

### 📡 2. IoT Smart Bins Telemetry (`/bins`)
- Real-time ultrasonic fill level monitoring (0–100%).
- Temperature (°C) and battery level telemetry per bin.
- Status classification: `available`, `almost-full`, `full`, `offline`.
- Live simulated telemetry engine for urban deployment demonstrations (`/api/iot/simulate`).

### 🎫 3. Civic Complaint & Dispatch System (`/complaints`)
- Citizen ticket creation for bin overflows, illegal dumping, damaged infrastructure, or missed collections.
- Automated ticket generation format (`ECO-2026-XXXXX`).
- Priority labeling: `Low`, `Medium`, `High`, `Critical`.
- Municipal administrative dispatch workflow with status tracking (`submitted`, `assigned`, `in-progress`, `resolved`).

### 🏆 4. Citizen Eco Rewards & Anti-Cheat Ledger (`/rewards`)
- Gamified sustainability levels:
  - 🌱 **Eco Starter** (0–99 pts)
  - 🌿 **Green Citizen** (100–299 pts)
  - ♻️ **Recycling Champion** (300–699 pts)
  - 🌎 **Eco Warrior** (700–1499 pts)
  - 🏆 **Sustainability Leader** (1500+ pts)
- Daily segregation streak tracking.
- Immutable reward transaction ledger with audit status.
- Community leaderboard recognizing top civic segregators.

### 🚛 5. Municipal Collection Scheduling (`/collection`)
- Door-to-door schedule viewer filtered by urban wards and zones.
- Segregated collection streams: Dry Waste, Wet Waste, Recyclables, E-Waste, Hazardous.
- Vehicle numbers and route dispatch status.

### 📍 6. Nearby Recycling Centers Directory (`/centers`)
- Directory of verified e-waste hubs, composting yards, dry waste centers, and hazardous disposal facilities.
- Filter by accepted waste streams with distance (km) and contact hours.

### 📚 7. Education Center & Interactive Quiz (`/education`)
- Municipal color-coded bin guide.
- Interactive 5-question eco knowledge quiz with instant feedback and score tracking.

### 🏛️ 8. Municipal Command Center (`/admin`)
- Administrative dashboard with city-wide KPIs: active bins, overflowing bins, pending complaints, segregation accuracy rates.
- Complaint dispatch management table.
- One-click live IoT telemetry simulation trigger.

### 🤖 9. SEGREGO Bot Assistant
- Persistent floating assistant chatbot accessible across all pages for instant segregation queries.

---

## 🏗️ Architecture & Tech Stack

```
SEGREGO Platform
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, EcoBot
│   │   ├── context/            # AuthContext (JWT state management)
│   │   ├── pages/              # 12 functional views
│   │   ├── services/           # Centralized Axios API layer
│   │   ├── utils/              # Canvas image pixel classifier
│   │   └── index.css           # Eco-futuristic design system
│   └── vite.config.js          # API reverse proxy configuration
│
└── server/                     # Node.js + Express + MongoDB Backend
    ├── src/
    │   ├── controllers/        # Auth, Scans, IoT, Complaints, Rewards, etc.
    │   ├── middleware/         # JWT verification, Role-based access control
    │   ├── models/             # Mongoose schemas (8 collections)
    │   ├── routes/             # RESTful API route definitions
    │   ├── seed.js             # Automated database bootstrap script
    │   ├── app.js              # Express app, static client serving & SPA fallback
    │   └── server.js           # Server entry point, auto-fallback In-Memory DB
```

- **Frontend**: React 18, Vite, React Router 6, Axios, Custom Glassmorphic CSS Design System.
- **Backend**: Node.js, Express 4, MongoDB (Mongoose), Socket.IO, JWT, bcryptjs, Helmet, Morgan.
- **Resilience**: Auto-fallback to In-Memory MongoDB (`mongodb-memory-server`) if a local/remote MongoDB instance is unavailable, ensuring the application runs out-of-the-box anywhere.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/segrego.git
cd segrego
```

### 2. Install Dependencies
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Environment Configuration (Optional)
The server works out-of-the-box with auto-fallback database support. To connect to an external MongoDB instance:
```bash
cd server
cp .env.example .env
# Edit .env and supply your MONGO_URI and JWT_SECRET
```

### 4. Seed Demo Data (Optional)
```bash
cd server
node src/seed.js
```

### 5. Run Development Servers
Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm start
# Runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Runs on http://localhost:3000
```

---

## 📦 Unified Production Mode

You can build the frontend and serve both API and web UI from a single Node.js process:

```bash
# 1. Build frontend
cd client && npm run build

# 2. Start unified server
cd ../server && npm start
```
Open **`http://localhost:5000`** in your browser.

---

## 🐳 Docker Deployment

Run the complete multi-container setup (Web App + MongoDB) with a single command:

```bash
docker compose up --build
```
Access the application at `http://localhost:5000`.

---

## ☁️ 1-Click Cloud Deployment

### Deploy to Render.com (Free)
1. Push this repository to your GitHub account.
2. Sign in to [Render.com](https://render.com) and click **New +** → **Web Service**.
3. Select your repository. Render will automatically detect `render.yaml`:
   - **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start Command**: `cd server && npm start`
4. Click **Create Web Service**.

### Deploy to Railway.app
1. Go to [Railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
2. Railway will automatically detect the root `Dockerfile` and deploy the unified app.

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| 👤 **Citizen Account** | `demo@ecosort.ai` | `Demo@123` | AI Scanner, Smart Bins, Rewards, Tickets, Education |
| 🏛️ **Municipal Admin** | `admin@ecosort.ai` | `Admin@123` | Full access + Municipal Command Center & IoT Simulator |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
