# Backend - Energy Efficiency Tracker API

REST API built with FastAPI to calculate and manage energy efficiency metrics in buildings.

## 🚀 Features

- **RESTful API** with FastAPI
- **Data validation** with Pydantic
- **Automated efficiency calculations**
- **MongoDB storage** with optimized indexes
- **Interactive documentation** with Swagger UI
- **Robust error handling**
- **CORS configured** for frontend

## 📦 Installation

### Prerequisites

- Python 3.9 or higher
- MongoDB (via Docker recommended)
- pip

### Installation Steps

1. **Create virtual environment:**

```bash
python -m venv venv
```

2. **Activate virtual environment:**

Windows:
```bash
venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables:**

Create `.env` file in the `backend/` directory:

```env
MONGODB_URL=mongodb://admin:admin123@localhost:27017/
MONGODB_DB_NAME=energy_efficiency
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

5. **Start MongoDB:**

```bash
# From project root directory
docker-compose up -d
```

6. **Run the server:**

```bash
python main.py
```

Server will be available at: `http://localhost:8000`

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Main Endpoints

#### 1. Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-10T12:00:00"
}
```

#### 2. Calculate Efficiency

```http
POST /api/efficiency/calculate
Content-Type: application/json
```

**Request Body:**
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
  ]
}
```

**Response (201 Created):**
```json
{
  "_id": "65a1b2c3d4e5f6789012345",
  "building_id": "60f7b3b3e4b0f3d4c8b4567a",
  "measure_name": "High-Efficiency HVAC System",
  "calculation_timestamp": "2024-01-10T12:00:00",
  "periods": [...],
  "summary": {
    "total_cost_savings": 2345.67,
    "total_electric_savings_kwh": 12000,
    "total_gas_savings_therms": 1700,
    "average_efficiency_improvement_percent": 15.5,
    "overall_performance_grade": "A (Very Good)",
    "best_performing_period": "business_hours",
    "worst_performing_period": "weekend"
  },
  "created_at": "2024-01-10T12:00:00"
}
```

#### 3. Get Building Calculations

```http
GET /api/efficiency/building/{building_id}
```

**Example:**
```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a
```

#### 4. Get Calculations by Period

```http
GET /api/efficiency/building/{building_id}/period/{period}
```

Valid periods: `business_hours`, `after_hours`, `weekend`

**Example:**
```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/period/business_hours
```

#### 5. Get Building Summary

```http
GET /api/efficiency/building/{building_id}/summary
```

Returns the most recent calculation for the building.

## 🧮 Efficiency Calculations

### Implemented Formulas

**1. Energy Savings:**
```
electric_savings = baseline_electric - current_electric
gas_savings = baseline_gas - current_gas
```

**2. Cost Savings:**
```
electric_cost_savings = electric_savings × electric_rate
gas_cost_savings = gas_savings × gas_rate
total_cost_savings = electric_cost_savings + gas_cost_savings
```

**3. Efficiency Improvement (%):**
```
electric_efficiency = (electric_savings / baseline_electric) × 100
gas_efficiency = (gas_savings / baseline_gas) × 100

overall_efficiency = (total_cost_savings / total_baseline_cost) × 100
```

**4. Performance Grading:**

| Grade | Efficiency Range |
|-------|------------------|
| A+ (Excellent) | ≥ 20% |
| A (Very Good) | 15-19.99% |
| B+ (Good) | 10-14.99% |
| B (Satisfactory) | 5-9.99% |
| C (Needs Improvement) | 0-4.99% |
| D (Poor) | < 0% |

## 🗄️ Database Schema

### Collection: `efficiency_calculations`

```javascript
{
  _id: ObjectId("..."),
  building_id: "60f7b3b3e4b0f3d4c8b4567a",
  measure_name: "High-Efficiency HVAC System",
  calculation_timestamp: ISODate("2024-01-10T12:00:00Z"),
  periods: [
    {
      period: "business_hours",
      time_range: "08:00-18:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      current_electric_kwh: 45000,
      baseline_electric_kwh: 52000,
      electric_savings_kwh: 7000,
      electric_cost_savings: 840.00,
      electric_efficiency_improvement_percent: 13.46,
      // ... more fields
      performance_grade: "B+ (Good)"
    }
  ],
  summary: {
    total_cost_savings: 2345.67,
    total_electric_savings_kwh: 12000,
    total_gas_savings_therms: 1700,
    average_efficiency_improvement_percent: 15.5,
    overall_performance_grade: "A (Very Good)",
    best_performing_period: "business_hours",
    worst_performing_period: "weekend"
  },
  created_at: ISODate("2024-01-10T12:00:00Z")
}
```

### Indexes

```javascript
// Index on building_id
db.efficiency_calculations.createIndex({ building_id: 1 })

// Compound index for period queries
db.efficiency_calculations.createIndex({ 
  building_id: 1, 
  "periods.period": 1 
})

// Index on creation date
db.efficiency_calculations.createIndex({ created_at: -1 })
```

## 🏗️ Code Architecture

### `main.py`
- Main FastAPI application
- Endpoint definitions
- CORS middleware
- Lifecycle management (DB connection/disconnection)

### `models.py`
- Pydantic models for validation
- Request/response schemas
- Custom validators

### `calculations.py`
- Efficiency calculation functions
- Business logic
- Grading system

### `database.py`
- MongoDB client
- CRUD operations
- Index management

## ✅ Implemented Validations

- **Building ID:** Valid ObjectId format
- **Consumption:** Positive numeric values
- **Periods:** Valid names (business_hours, after_hours, weekend)
- **Days:** Valid day names in English
- **Rates:** Positive values

## 🔒 Error Handling

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Validation error |
| 404 | Resource not found |
| 500 | Internal server error |
| 503 | Service unavailable (DB disconnected) |

## 🧪 Testing (Future)

```python
# Proposed test structure
tests/
├── test_calculations.py   # Calculation tests
├── test_database.py       # DB tests
└── test_endpoints.py      # API tests
```

Run tests:
```bash
pytest
```

## 📊 Monitoring

### Logs

Server shows logs of:
- MongoDB connection/disconnection
- Incoming requests
- Errors and exceptions

### Metrics

Access metrics at `/health`:
- Database status
- Server timestamp

## 🚀 Deployment

### Production

1. **Configure environment variables for production:**

```env
MONGODB_URL=mongodb://user:password@mongodb-host:27017/
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=false
CORS_ORIGINS=https://your-frontend.com
```

2. **Use an ASGI server in production:**

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker (Optional)

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📝 Dependencies

```txt
fastapi==0.115.5         # Web framework
uvicorn==0.32.1          # ASGI server
pydantic==2.10.3         # Data validation
pymongo==4.10.1          # MongoDB client
python-dotenv==1.0.1     # Environment variables
```

## 🤝 Contributing

1. Follow PEP 8 for code style
2. Add docstrings to functions
3. Include type hints
4. Write tests for new features

## 📧 Support

For issues or questions, open an issue in the repository.

---

**Version:** 1.0.0  
**Python:** 3.9+  
**FastAPI:** 0.115.5
