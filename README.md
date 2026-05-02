# Fostride — Smart Waste Dashboard

<div align="center">

![Fostride](https://img.shields.io/badge/Fostride-W.I.S.E.-1a6b35?style=for-the-badge&logo=leaflet&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### 🔗 Live Demo → https://fostride-dashboard.web.app

</div>

---

## 🌿 About

Fostride's Smart Waste Dashboard is a full-stack web application powering **W.I.S.E. (Waste Intelligent Sorting Engine)** — the AI intelligence layer transforming how waste is understood, sorted, and managed at scale.

The platform features a public landing page, role-based authentication, real-time waste disposal logging, and a comprehensive admin analytics dashboard — all synced live via Firebase Firestore.

---

## ✨ Features

### 👤 User Dashboard
- Sign up & sign in with email/password
- Log waste disposal entries — type, quantity & auto-timestamped
- Personal stat cards — total entries, monthly count, total kg, top category
- Donut chart showing waste breakdown by category
- Real-time submission history — updates instantly without refresh

### 🔐 Admin Dashboard
- View all user submissions across the platform
- Filter by waste type · Search by user name or email
- Stat cards — total entries, registered users, total kg, today's count
- Waste type distribution chart + quantity by category bar chart
- Real-time data sync — any change reflects immediately

### 🌍 Landing Page
- Animated hero section with W.I.S.E. introduction
- Live scrolling ticker, animated stat counters
- R3Bin orbital diagram visualization
- Scroll-triggered reveal animations throughout

---

## 🗂️ Waste Categories

| | Type | Description |
|---|---|---|
| 🟡 | **Dry** | Paper, cardboard, plastics & non-organic materials |
| 💧 | **Wet** | Food scraps & organic matter routed to composting |
| ♻️ | **Recyclable** | Glass, metals & clean plastics for circular reuse |
| ⚠️ | **Hazardous** | Chemicals, batteries & e-waste for safe disposal |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Authentication | Firebase Auth (Email/Password) |
| Database | Firebase Firestore (Real-time) |
| Charts | Recharts |
| Hosting | Firebase Hosting |
| Fonts | Cabinet Grotesk · Instrument Serif · Syne |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/fostride-dashboard.git
cd fostride-dashboard
npm install
```

### 2. Firebase Setup

- Create a project at [Firebase Console](https://console.firebase.google.com/)
- Enable **Email/Password** Authentication
- Create a **Firestore Database**
- Add your Firebase config to `src/firebase.js`
- Set `role: "admin"` in Firestore for your admin user document

### 3. Run Locally

```bash
npm run dev
```

Open `http://localhost:5173`

### 4. Deploy

```bash
npm run build
firebase deploy
```

---

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@fostride.com | Admin@123 |
| User | Register via Sign Up | — |

---

## 📸 Pages

| Page | Access |
|---|---|
| Landing | Public |
| Login / Sign Up | Public |
| User Dashboard | Authenticated Users |
| Admin Dashboard | Admin Only |


<div align="center">

Built with 🌿 by **Puja Shetty**  

</div>