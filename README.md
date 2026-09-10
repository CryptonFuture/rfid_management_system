# 📡 RFID Management System

A complete full-stack **RFID Asset Management System** built with:

- **Backend**: Node.js + Express.js + MongoDB
- **Frontend**: React + Vite + Tailwind CSS
- **Simulator**: Python (for testing without hardware)

---

## ✨ Features

- 🔐 JWT Authentication (Admin / Operator roles)
- 📦 Asset Management (CRUD) with categories & status
- 🏷️ RFID Tag Management (UID tracking, assign/unassign)
- 📍 Location Management
- 📊 Dashboard with charts & real-time stats
- 📜 Scan History logging
- 🧪 Web-based Scan Simulator
- 🐍 Python RFID Simulator (CLI) for bulk/random testing
- Responsive modern UI

---

## 🗂️ Project Structure

```
rfid-management-system/
├── backend/                 # Node.js Express API
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth middleware
│   ├── config/              # DB config
│   ├── seed.js              # Sample data seeder
│   └── server.js
├── frontend/                # React + Vite app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── services/
├── python-simulator/        # Python RFID simulator
│   ├── simulator.py
│   └── requirements.txt
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.8+ (optional, for simulator)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and set your MongoDB URI if needed

npm install
npm run seed          # Load sample data
npm run dev           # Start on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev           # Start on http://localhost:5173
```

### 3. Python Simulator (Optional)

```bash
cd python-simulator
pip install -r requirements.txt

# Interactive mode
python simulator.py

# Scan specific UID
python simulator.py --uid A1B2C3D4

# Random 10 scans
python simulator.py --random 10

# Continuous every 5 seconds
python simulator.py --loop 5
```

---

## 🔑 Demo Credentials

| Role     | Email              | Password    |
|----------|--------------------|-------------|
| Admin    | admin@rfid.com     | admin123    |
| Operator | operator@rfid.com  | operator123 |

---

## 📡 API Endpoints

| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| POST   | /api/auth/login       | Login                    | No   |
| POST   | /api/auth/register    | Register                 | No   |
| GET    | /api/dashboard        | Dashboard stats          | Yes  |
| GET    | /api/assets           | List assets              | Yes  |
| POST   | /api/assets           | Create asset             | Yes  |
| GET    | /api/rfid             | List RFID tags           | Yes  |
| POST   | /api/rfid             | Create tag               | Yes  |
| POST   | /api/rfid/scan        | Process RFID scan        | Optional |
| GET    | /api/rfid/scans       | Scan history             | Yes  |
| GET    | /api/locations        | List locations           | Yes  |

---

## 🛠️ Environment Variables (Backend)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rfid_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 📸 Screenshots Flow

1. **Login** → Use demo credentials
2. **Dashboard** → View stats, charts, recent scans
3. **Assets** → Add/Edit/Delete assets, assign RFID tags
4. **RFID Tags** → Manage tag inventory
5. **Simulate Scan** → Test scanning from the web UI
6. **Python Simulator** → Send scans from terminal

---

## 🧩 Tech Stack Details

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind, Recharts, Lucide Icons |
| Backend    | Node.js, Express, Mongoose, JWT, bcrypt |
| Database   | MongoDB                             |
| Simulator  | Python 3 + Requests                 |

---

## 📝 License

MIT License – Feel free to use and modify.

---

**Built with ❤️ for RFID Asset Tracking**
```# rfid_management_system
