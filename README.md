# ⚡ Energy Efficiency Tracker

Complete energy efficiency tracking and analysis system for buildings, developed with FastAPI, MongoDB, and React.

## 📋 Description

This application allows you to:
- **Calculate energy efficiency improvements** by comparing current consumption vs. baseline
- **Manage operational periods** (Business Hours, After Hours, Weekend)
- **Generate detailed reports** with savings metrics and performance grades
- **Visualize data** with interactive charts
- **Store historical data** in MongoDB for temporal analysis

## 🏗️ Architecture

```
energy-efficiency-tracker/
├── backend/          # API FastAPI + Python
├── frontend/         # React + Vite
├── docs/             # Documentation
└── docker-compose.yml # MongoDB with Docker
```

### Tech Stack

**Backend:**
- FastAPI 0.109.0
- Python 3.9+
- PyMongo 4.6.1
- Pydantic 2.5.3

**Frontend:**
- React 18.2.0
- Vite 5.0.11
- Recharts 2.10.4
- Axios 1.6.5

**Database:**
- MongoDB 7.0 (Docker)
- Mongo Express (UI Admin)

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/davidcalvo-ps/energy-efficiency-tracker.git
cd energy-efficiency-tracker
```

### 2. Start MongoDB with Docker

**IMPORTANT:** You must start MongoDB before running the backend!

```bash
# Make sure you're in the project root directory
docker-compose up -d
```

Wait a few seconds for MongoDB to fully start, then verify it's running:

```bash
docker ps
```

You should see `energy-efficiency-mongodb` container running.

This will start:
- **MongoDB** on `localhost:27017`
- **Mongo Express** on `http://localhost:8081` (admin UI)

### 3. Setup and Run Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell/CMD):
venv\Scripts\activate
# Windows (Git Bash):
source venv/Scripts/activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# IMPORTANT: Make sure MongoDB is running first!
# Run this in the project root directory:
docker-compose up -d

# Run server
python main.py
```

Backend will be available at: **http://localhost:8000**

Interactive API Docs: **http://localhost:8000/docs**

### 4. Setup and Run Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

## 📊 Using the Application

### 1. Calculate Energy Efficiency

1. Go to **"Calculate Efficiency"** section
2. Click **"Load Sample Data"** for test data
3. Review/modify:
   - Building ID
   - Measure Name
   - Consumption data per period (current vs. baseline)
4. Click **"Calculate Efficiency"**
5. View results in Dashboard automatically

### 2. View Building Dashboard

The dashboard displays:

**Summary Cards:**
- 💰 Total Cost Savings
- ⚡ Total Electric Savings
- 🔥 Total Gas Savings
- 📈 Average Efficiency Improvement
- 🏆 Performance Grade

**Charts:**
- Bar Chart: Comparison of improvements by period
- Pie Chart: Distribution of cost savings

**Period Breakdown:**
- Detailed metrics per period
- Comparison bars current vs. baseline consumption
- Performance grades

## 🔧 Configuration

### Environment Variables

**Backend** (`backend/.env`):
```env
MONGODB_URL=mongodb://admin:admin123@localhost:27017/
MONGODB_DB_NAME=energy_efficiency
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Calculate Efficiency
```http
POST /api/efficiency/calculate
Content-Type: application/json

{
  "building_id": "60f7b3b3e4b0f3d4c8b4567a",
  "measure_name": "High-Efficiency HVAC System",
  "periods": [...]
}
```

### Get Building Calculations
```http
GET /api/efficiency/building/{building_id}
```

### Get Calculations by Period
```http
GET /api/efficiency/building/{building_id}/period/{period}
```

### Get Building Summary
```http
GET /api/efficiency/building/{building_id}/summary
```

See complete documentation at: **http://localhost:8000/docs**

## 🧪 Test Data

Example of office building with HVAC upgrade:

```json
{
  "building_id": "60f7b3b3e4b0f3d4c8b4567a",
  "measure_name": "High-Efficiency HVAC System",
  "periods": [
    {
      "period": "business_hours",
      "time_range": "08:00-18:00",
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "current_electric_kwh": 45000,
      "current_gas_therms": 3200,
      "baseline_electric_kwh": 52000,
      "baseline_gas_therms": 4100,
      "electric_rate": 0.12,
      "gas_rate": 0.95
    }
    // ... more periods
  ]
}
```

## 📚 Additional Documentation

- [Backend README](backend/README.md) - API Details
- [Frontend README](frontend/README.md) - Frontend Architecture
- [API Documentation](docs/API_DOCUMENTATION.md) - Complete Endpoint Specification
- [Assumptions](docs/ASSUMPTIONS.md) - Design Decisions

## 🧮 Grading System

| Grade | Efficiency Improvement | Color |
|-------|----------------------|-------|
| A+ (Excellent) | ≥ 20% | Green |
| A (Very Good) | 15-19.99% | Light Green |
| B+ (Good) | 10-14.99% | Blue |
| B (Satisfactory) | 5-9.99% | Light Blue |
| C (Needs Improvement) | 0-4.99% | Yellow |
| D (Poor) | < 0% | Red |

## 🛠️ Development

### Backend Structure

```
backend/
├── main.py              # FastAPI application
├── models.py            # Pydantic models
├── calculations.py      # Calculations logic
├── database.py          # MongoDB client
└── requirements.txt     # Dependencies
```

### Frontend Structure

```
frontend/src/
├── components/
│   ├── EfficiencyCalculator/   # Input form
│   ├── EfficiencyDashboard/    # Main dashboard
│   └── BuildingSelector/        # Building selector
├── services/
│   └── api.js                   # API client
└── App.jsx                      # Root component
```

### Run Tests (Coming Soon)

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## 🐛 Troubleshooting

### MongoDB Authentication Failed
**Error:** `pymongo.errors.OperationFailure: Authentication failed`

**Solution:**
1. Make sure MongoDB is running:
   ```bash
   docker ps
   ```
   You should see `energy-efficiency-mongodb` container.

2. If not running, start it:
   ```bash
   docker-compose up -d
   ```

3. Wait 10-15 seconds for MongoDB to fully initialize

4. Verify MongoDB is accessible:
   ```bash
   docker logs energy-efficiency-mongodb
   ```
   Look for "Waiting for connections" message

5. If still failing, restart containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Virtual Environment Activation Issues (Windows/Git Bash)
**Error:** `bash: venv/bin/activate: No such file or directory`

**Solution:**
- In Git Bash, use: `source venv/Scripts/activate`
- In PowerShell/CMD, use: `venv\Scripts\activate`
- Make sure you're in the `backend` directory

### MongoDB won't connect
```bash
# Verify Docker is running
docker ps

# Check MongoDB logs
docker logs energy-efficiency-mongodb

# Restart containers
docker-compose down
docker-compose up -d
```

### CORS error in Frontend
Verify that `CORS_ORIGINS` in `backend/.env` includes the frontend URL.

### ObjectId validation error
Ensure that `building_id` is a valid 24-character hexadecimal ObjectId.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT License.

## 👥 Author

Developed as part of Buildee's technical assessment.

## 🙏 Acknowledgments

- FastAPI for the excellent framework
- Recharts for visualization components
- MongoDB for the flexible database

---

**Questions?** Open an issue in the repository.

**Status:** ✅ Production Ready

