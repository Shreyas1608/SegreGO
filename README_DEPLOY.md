# SEGREGO — Deployment Guide 🚀

## 🌐 Instant Live Public URL (Active Now)
Your application is currently live and tunneled over secure HTTPS:
- **Public URL**: [https://moody-pans-go.loca.lt](https://moody-pans-go.loca.lt)
- **Tunnel Password / IP (if prompted by localtunnel)**: `43.247.156.18`

---

## 🏛️ Permanent 1-Click Cloud Deployment (Free)

### Method 1: Deploy on Render.com (Recommended)
1. Push this project to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of SEGREGO Smart Waste Platform"
   git remote add origin https://github.com/YOUR_USERNAME/segrego.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [https://render.com](https://render.com) and click **New +** → **Web Service**.
3. Connect your repository.
4. Render will automatically detect `render.yaml` with the pre-configured settings:
   - **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variable**: `PORT=10000`, `NODE_ENV=production`
5. Click **Deploy** — your app will be live at `https://segrego-xxx.onrender.com`!

---

### Method 2: Deploy on Railway.app
1. Go to [https://railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select this repo. Railway uses the root `Dockerfile` automatically and provisions a public domain.

---

### Method 3: Run with Docker locally or on any VPS / Cloud VM
```bash
docker build -t segrego .
docker run -p 5000:5000 -e PORT=5000 segrego
```
Visit `http://localhost:5000`.

---

## 🔑 Demo Login Credentials
- **Citizen Account**: `demo@ecosort.ai` / `Demo@123`
- **Admin Account**: `admin@ecosort.ai` / `Admin@123`
