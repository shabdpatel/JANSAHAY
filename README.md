# 🏙️ CivicTrack – Smart City Issue Reporter & Analyzer

[![Status](https://img.shields.io/badge/Status-Under_Construction-orange?style=for-the-badge)]()
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)]()

> A full-stack civic issue reporting platform for citizens to raise concerns like potholes, garbage dumps, water leaks, and more — all powered by maps, real-time status, and admin dashboards.

---

## 🌐 Project Overview

CivicTrack is a responsive web app designed for **urban citizen engagement and governance analytics**. It allows users to report local civic problems via a map interface, while authorities can view insights, resolve complaints, and track performance through a Power BI dashboard.

---

## 📁 Folder Structure

```
civictrack/
├── client/               # Frontend: React + Tailwind CSS + Mapbox
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── contexts/
│       └── utils/
│
├── server/               # Backend: Node.js + Express + MongoDB
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── utils/
│   └── index.js
│
├── data-analysis/        # Python Scripts + Exports + BI
│   ├── notebooks/
│   ├── scripts/
│   ├── data_exports/
│   └── visualizations/
│
├── docs/                 # Wireframes, diagrams, reports
│   ├── wireframes/
│   ├── architecture/
│   ├── ppt/
│   └── reports/
│
├── .env.example          # Sample environment variables
├── .gitignore
├── README.md
└── package.json
```

---

## 🚀 Tech Stack

| Layer          | Technologies                          |
|----------------|----------------------------------------|
| Frontend       | React, Tailwind CSS, Mapbox, Axios     |
| Backend        | Node.js, Express, MongoDB, Firebase    |
| Auth           | Firebase Auth (Google + Email OTP)     |
| Analytics      | Python, Pandas, NumPy, Matplotlib      |
| Dashboard      | Power BI (with MySQL/CSV data source)  |
| Tools          | GitHub Projects, Figma, Jupyter, Excel |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shabdpatel/civictrack.git
cd civictrack
```

### 2. Set Up Environment Variables

Create a `.env` file in both `/client` and `/server` using the template provided in `.env.example`.

```env
# Example (for server/.env)
MONGODB_URI=your_mongo_uri
FIREBASE_API_KEY=your_firebase_key
MAPBOX_TOKEN=your_mapbox_key
```

### 3. Install Dependencies

**Frontend:**

```bash
cd client
npm install
```

**Backend:**

```bash
cd server
npm install
```

---

## 📌 Features (Planned)

* 🗺️ Map-based issue reporting with image upload
* 📊 Real-time issue status & history tracking
* 🔐 Firebase login (Google / Email OTP)
* ⚙️ RESTful APIs for issue CRUD & updates
* 📈 Admin dashboard with heatmaps & resolution insights
* 🧠 Python-based issue prioritization & auto-escalation
* 📤 Data exports for Power BI integration
* 🗳️ Community voting & gamification (optional)

---

## 👩‍💻 Contributors

| Name            | GitHub Profile                                         |
| --------------- | ------------------------------------------------------ |
| **Shabd Patel** | [github.com/shabdpatel](https://github.com/shabdpatel) |
| **Nancy**       | [github.com/nancy8580](https://github.com/nancy8580)   |

---

## 📌 Status

> 🚧 **This project is currently under construction (Phase 1: Setup & Planning)**
> Stay tuned for live deployment links, UI demos, and Power BI snapshots.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
