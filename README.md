# 🌿 SEGREGO

> **AI-Powered Smart Waste Segregation & Sustainable Urban Waste Management Platform**

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-MobileNet-orange?logo=tensorflow)](https://www.tensorflow.org/js)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS%20Maps-green?logo=leaflet)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Overview

**SEGREGO** is a full-stack urban waste management and sustainability web application tailored for municipal waste segregation at source.

It combines **in-browser AI computer vision**, **interactive GIS mapping across Bengaluru BBMP wards**, **smart IoT bin telemetry**, **civic complaint triage**, and **gamified citizen rewards** to create a circular economy loop between citizens, field officers, and municipal authorities.

---

## ✨ Key Features

### 🤖 1. Zero-Cost Browser AI Waste Scanner (`/ai-detect`)
- **TensorFlow.js MobileNet Deep Neural Network**: Runs 100% locally in the browser with **zero API key requirement and zero cost**.
- **Real Object Recognition**: Accurately classifies plastic bottles, plastic bags, aluminum cans, cardboard boxes, food waste, laptops, glass jars, and batteries with 90%+ confidence.
- **Municipal Color-Coded Bin Recommendation**: Specifies correct municipal bin color (🟢 Green Bin, 🔵 Blue Bin, 🔴 Red Bin, 🟡 Yellow Bin, ⚪ White Bin, ⚫ Black Bin).
- **Preparation & Ecological Impact Steps**: Clear rinsing, flattening, hazard safety instructions, and CO₂ offset metrics.

---

### 🗺️ 2. Bengaluru Interactive GIS Leaflet Maps (`/centers` & `/bins`)
- **Centered on Bengaluru (`lat: 12.9716, lng: 77.5946`)**: Pre-configured with BBMP wards (Koramangala, Indiranagar, Electronic City, HSR Layout, Whitefield, Malleshwaram, Banashankari, Peenya).
- **Custom Color-Coded Pins**:
  - 🟢 Green Pin: Available Bins (<70% fill) / Compost Yards.
  - 🟡 Gold Pin: Almost Full Bins (70-89% fill).
  - 🔴 Red Pin: Full Bins (90%+ fill).
  - 🔵 Blue Pin: Dry Waste Collection Centers (DWCCs) & Recyclers.
  - ⚡ Purple Pin: E-Waste Hubs.
- **Rich Click Popups & Navigation**: Live fill meters, accepted waste badges, and a 🗺️ **"Get Directions in Google Maps"** button.
- **📍 "Locate Near Me" Button**: HTML5 browser geolocation centering the map on the user's position.
- **Dual View Modes**: Seamless toggle between `🗺️ Map View` and `📋 Grid Cards`.

---

### 🏛️ 3. BBMP Municipal Admin Command Console (`/admin`)
- **7-Tab Central Control Dashboard**:
  - 📊 **Overview & City KPIs**: Real-time stats on citizens, active bins, overflowing bins, and pending tickets.
  - 📡 **Smart Bins Control**: Modal to **add new bins**, edit locations, **empty bins (reset fill to 0%)**, and delete damaged bins.
  - 📍 **Directory Admin**: Add, edit, or delete recycling centers, DWCCs, and compost yards.
  - 📋 **Civic Ticket Triage & Resolution**: Inspect citizen complaint descriptions, view uploaded photo evidence, assign field officers, enter resolution remarks, and **auto-reward citizens (+20 Eco Points)** upon resolution.
  - 👥 **Citizen User & Role Manager**: Promote/demote `citizen` ↔ `admin` roles and award bonus points.
  - 🎟️ **Reward Vouchers Catalog**: Create, activate, or deactivate reward coupons.
  - 📊 **Municipal Audit CSV Data Exports**: One-click CSV downloads for Ward Bins Telemetry and Complaints Resolution logs.

---

### 🛍️ 4. Citizen Rewards Voucher Store (`/rewards`)
- Redeem earned Eco Points for real discount vouchers:
  - 🚆 **Namma Metro 20% Discount Pass**
  - 🪴 **Eco Home Compost Kit**
  - 🛒 **Zero-Waste Store ₹200 Voucher**
  - 💡 **BESCOM Solar Electricity Bill Credit**
- Generates unique redemption coupon codes (e.g. `ECO-BLR-892410`) and logs immutable transactions in MongoDB.

---

### 🤖 5. Floating EcoBot Assistant
- Persistent floating chatbot accessible across all pages with an expanded knowledge base covering 50+ household waste items and disposal protocols.

---

### 💾 6. Auto-Fallback Database & Pre-Seeded Dataset
- **Auto-Fallback In-Memory MongoDB**: If local MongoDB is not installed or running, the server automatically boots `mongodb-memory-server` in Node memory.
- **Pre-Loaded Bengaluru Seed Dataset**: Automatically populates demo users, smart bins, DWCCs, collection schedules, complaints, and vouchers on first boot.

---

## 🚀 Step-by-Step Execution Guide for Teammates

Follow these steps to run SEGREGO on any new machine:

### 📋 Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository
Open your terminal/command prompt and clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/SegreGo.git
cd SegreGo
```

---

### 2️⃣ Install All Dependencies
Run the unified installer script to install root, backend server, and frontend client dependencies in one command:
```bash
npm run install:all
```
*(Alternative: You can manually run `cd server && npm install` then `cd ../client && npm install`)*

---

### 3️⃣ Run the Application

#### Option A: Unified Production Mode (Recommended - 1 Command)
Build the frontend client and run the unified server on a single port:
```bash
npm start
```
- Open **`http://localhost:5000`** in your browser!

---

#### Option B: Development Mode (2 Terminals)
Run server and client concurrently with hot-reloading:

**Terminal 1 (Backend API & Database):**
```bash
npm run dev:server
```
*(Runs backend server on `http://localhost:5000`)*

**Terminal 2 (Frontend Client UI):**
```bash
npm run dev:client
```
*(Runs Vite React server on `http://localhost:3000`)*

- Open **`http://localhost:3000`** in your browser!

---

## 🔑 Demo Login Credentials

The database is pre-seeded with initial demo accounts:

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| 👤 **Citizen Account** | `demo@ecosort.ai` | `Demo@123` | AI Waste Classifier, Interactive Maps, Voucher Store, Complaints, EcoBot |
| 🏛️ **BBMP Municipal Admin** | `admin@ecosort.ai` | `Admin@123` | Municipal Command Console, IoT Telemetry Control, Ticket Dispatching |

> 💡 **1-Click Role Switcher**: When logged in, click the **`👤 Mode: Citizen (Switch to Admin)`** button in the top navigation bar to toggle between Citizen and Admin modes instantly!

---

## 🏗️ Architecture & Project Structure

```text
SegreGo/
├── client/                     # React 18 + Vite Frontend Client
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/         # Navbar, Footer, EcoBot, InteractiveMap (Leaflet)
│   │   ├── context/            # AuthContext (JWT & 1-click Role Switcher)
│   │   ├── pages/              # AIDetect, SmartBins, NearbyCenters, Rewards, AdminDashboard, etc.
│   │   ├── services/           # Centralized Axios API service layer (api.js)
│   │   └── utils/              # TensorFlow.js MobileNet Vision Classifier (imageClassifier.js)
│   └── package.json            # Client dependencies (@tensorflow/tfjs, leaflet, react-leaflet)
│
├── server/                     # Node.js + Express + MongoDB Backend Server
│   ├── src/
│   │   ├── controllers/        # auth, scan, bin, center, complaint, reward, iot, analytics
│   │   ├── middleware/         # JWT authentication & adminOnly middleware
│   │   ├── models/             # Mongoose schemas (User, Bin, RecyclingCenter, Complaint, Voucher, etc.)
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── seed.js             # Automated database bootstrap script with Bengaluru dataset
│   │   ├── app.js              # Express app, static client serving & SPA fallback
│   │   └── server.js           # Server entry point & MongoMemoryServer auto-fallback
│   └── package.json            # Server dependencies (mongoose, express, socket.io, bcryptjs)
│
├── docker-compose.yml          # Multi-container Docker configuration
├── Dockerfile                  # Production container Dockerfile
├── render.yaml                 # Render.com deployment setup
└── package.json                # Root package configuration & script runner
```

---

## ❓ Frequently Asked Questions (FAQ) & Troubleshooting

#### Q1: Do I need to install MongoDB on my laptop to run this?
> **No!** The server includes an **Auto-Fallback In-Memory MongoDB Server (`mongodb-memory-server`)**. If you do not have MongoDB running locally, the server automatically starts an in-memory database and populates all dummy data on first boot.

#### Q2: Do I need an API key for the AI Waste Scanner or Maps?
> **No!**
> - The AI Scanner uses **TensorFlow.js MobileNet** running 100% locally inside your browser.
> - The Interactive Maps use **Leaflet.js & OpenStreetMap**, which operate completely free without requiring an API key.

#### Q3: Port 5000 or 3000 is already in use on my machine. What should I do?
> You can specify custom ports in `server/.env`:
> ```env
> PORT=5001
> ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
