# API Documentation - Energy Efficiency Tracker

Complete REST API documentation for the energy efficiency tracking system.

## 📡 Base URL

```
http://localhost:8000
```

## 🔐 Authentication

Currently the API does not require authentication. For production, it's recommended to implement:
- API Keys
- OAuth 2.0
- JWT tokens

## 📊 Response Format

All responses are in JSON format with UTF-8 encoding.

**Response headers:**
```
Content-Type: application/json
```

## ⚠️ HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or invalid data |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Internal server error |
| 503 | Service Unavailable | Service unavailable (DB disconnected) |

---

## 🔗 Endpoints

### 1. Health Check

Verifies server status and database connection.

```http
GET /health
```

#### Successful Response (200 OK)

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-10T12:00:00.000000"
}
```

#### DB Error Response (503 Service Unavailable)

```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection timeout",
  "timestamp": "2024-01-10T12:00:00.000000"
}
```

---

### 2. Calculate Energy Efficiency

Calculates energy efficiency metrics for a building based on current vs baseline consumption data.

```http
POST /api/efficiency/calculate
Content-Type: application/json
```

#### Request Body

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
    },
    {
      "period": "after_hours",
      "time_range": "18:00-08:00",
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "current_electric_kwh": 28000,
      "current_gas_therms": 2200,
      "baseline_electric_kwh": 35000,
      "baseline_gas_therms": 2800,
      "electric_rate": 0.08,
      "gas_rate": 0.95
    },
    {
      "period": "weekend",
      "time_range": "00:00-24:00",
      "days": ["Saturday", "Sunday"],
      "current_electric_kwh": 15000,
      "current_gas_therms": 1200,
      "baseline_electric_kwh": 20000,
      "baseline_gas_therms": 1600,
      "electric_rate": 0.10,
      "gas_rate": 0.95
    }
  ]
}
```

#### Request Parameters

| Field | Type | Required | Description |
|-------|------|-----------|-------------|
| `building_id` | string | Yes | Building ID (Valid ObjectId - 24 characters) |
| `measure_name` | string | Yes | Efficiency measure name |
| `periods` | array | Yes | Array of operational periods (1-10) |

**Fields for each period:**

| Field | Type | Required | Description |
|-------|------|-----------|-------------|
| `period` | string | Yes | Period type: `business_hours`, `after_hours`, `weekend` |
| `time_range` | string | Yes | Time range (e.g., "08:00-18:00") |
| `days` | array[string] | Yes | Applicable days (Monday-Sunday) |
| `current_electric_kwh` | number | Yes | Current electric consumption in kWh (> 0) |
| `current_gas_therms` | number | Yes | Current gas consumption in therms (> 0) |
| `baseline_electric_kwh` | number | Yes | Baseline electric consumption in kWh (> 0) |
| `baseline_gas_therms` | number | Yes | Baseline gas consumption in therms (> 0) |
| `electric_rate` | number | Yes | Electric rate per kWh (> 0) |
| `gas_rate` | number | Yes | Gas rate per therm (> 0) |

#### Successful Response (201 Created)

```json
{
  "_id": "65a1b2c3d4e5f6789012345",
  "building_id": "60f7b3b3e4b0f3d4c8b4567a",
  "measure_name": "High-Efficiency HVAC System",
  "calculation_timestamp": "2024-01-10T12:00:00.000000",
  "periods": [
    {
      "period": "business_hours",
      "time_range": "08:00-18:00",
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "current_electric_kwh": 45000,
      "current_gas_therms": 3200,
      "baseline_electric_kwh": 52000,
      "baseline_gas_therms": 4100,
      "electric_savings_kwh": 7000,
      "gas_savings_therms": 900,
      "electric_cost_savings": 840.0,
      "gas_cost_savings": 855.0,
      "total_cost_savings": 1695.0,
      "electric_efficiency_improvement_percent": 13.46,
      "gas_efficiency_improvement_percent": 21.95,
      "overall_efficiency_improvement_percent": 15.83,
      "performance_grade": "A (Very Good)"
    },
    {
      "period": "after_hours",
      "time_range": "18:00-08:00",
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "current_electric_kwh": 28000,
      "current_gas_therms": 2200,
      "baseline_electric_kwh": 35000,
      "baseline_gas_therms": 2800,
      "electric_savings_kwh": 7000,
      "gas_savings_therms": 600,
      "electric_cost_savings": 560.0,
      "gas_cost_savings": 570.0,
      "total_cost_savings": 1130.0,
      "electric_efficiency_improvement_percent": 20.0,
      "gas_efficiency_improvement_percent": 21.43,
      "overall_efficiency_improvement_percent": 20.62,
      "performance_grade": "A+ (Excellent)"
    },
    {
      "period": "weekend",
      "time_range": "00:00-24:00",
      "days": ["Saturday", "Sunday"],
      "current_electric_kwh": 15000,
      "current_gas_therms": 1200,
      "baseline_electric_kwh": 20000,
      "baseline_gas_therms": 1600,
      "electric_savings_kwh": 5000,
      "gas_savings_therms": 400,
      "electric_cost_savings": 500.0,
      "gas_cost_savings": 380.0,
      "total_cost_savings": 880.0,
      "electric_efficiency_improvement_percent": 25.0,
      "gas_efficiency_improvement_percent": 25.0,
      "overall_efficiency_improvement_percent": 25.0,
      "performance_grade": "A+ (Excellent)"
    }
  ],
  "summary": {
    "total_electric_savings_kwh": 19000.0,
    "total_gas_savings_therms": 1900.0,
    "total_cost_savings": 3705.0,
    "average_efficiency_improvement_percent": 20.48,
    "overall_performance_grade": "A+ (Excellent)",
    "best_performing_period": "weekend",
    "worst_performing_period": "business_hours"
  },
  "created_at": "2024-01-10T12:00:00.000000"
}
```

#### Error Response (400 Bad Request)

```json
{
  "detail": "Validation error: Invalid building_id format. Must be a valid ObjectId"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/api/efficiency/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "building_id": "60f7b3b3e4b0f3d4c8b4567a",
    "measure_name": "High-Efficiency HVAC System",
    "periods": [...]
  }'
```

---

### 3. Get All Building Calculations

Gets all historical calculations for a specific building.

```http
GET /api/efficiency/building/{building_id}
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `building_id` | string | Building ID (Valid ObjectId) |

#### Successful Response (200 OK)

Returns an array of calculations sorted by date (newest first):

```json
[
  {
    "_id": "65a1b2c3d4e5f6789012345",
    "building_id": "60f7b3b3e4b0f3d4c8b4567a",
    "measure_name": "High-Efficiency HVAC System",
    "calculation_timestamp": "2024-01-10T12:00:00.000000",
    "periods": [...],
    "summary": {...},
    "created_at": "2024-01-10T12:00:00.000000"
  },
  {
    "_id": "65a1b2c3d4e5f6789012344",
    "building_id": "60f7b3b3e4b0f3d4c8b4567a",
    "measure_name": "LED Lighting Upgrade",
    "calculation_timestamp": "2024-01-09T10:00:00.000000",
    "periods": [...],
    "summary": {...},
    "created_at": "2024-01-09T10:00:00.000000"
  }
]
```

#### Error Response (404 Not Found)

```json
{
  "detail": "No calculations found for building ID: 60f7b3b3e4b0f3d4c8b4567a"
}
```

#### cURL Example

```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a
```

---

### 4. Get Calculations by Period

Gets calculations filtered by a specific operational period.

```http
GET /api/efficiency/building/{building_id}/period/{period}
```

#### URL Parameters

| Parameter | Type | Valid Values | Description |
|-----------|------|--------------|-------------|
| `building_id` | string | ObjectId | Building ID |
| `period` | string | `business_hours`, `after_hours`, `weekend` | Period type |

#### Successful Response (200 OK)

```json
[
  {
    "_id": "65a1b2c3d4e5f6789012345",
    "building_id": "60f7b3b3e4b0f3d4c8b4567a",
    "measure_name": "High-Efficiency HVAC System",
    "calculation_timestamp": "2024-01-10T12:00:00.000000",
    "periods": [
      {
        "period": "business_hours",
        "time_range": "08:00-18:00",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "electric_savings_kwh": 7000,
        "total_cost_savings": 1695.0,
        "performance_grade": "A (Very Good)"
      }
    ],
    "summary": {...},
    "created_at": "2024-01-10T12:00:00.000000"
  }
]
```

#### Error Response (400 Bad Request)

```json
{
  "detail": "Invalid period. Must be one of: business_hours, after_hours, weekend"
}
```

#### Error Response (404 Not Found)

```json
{
  "detail": "No calculations found for building ID: 60f7b3b3e4b0f3d4c8b4567a and period: business_hours"
}
```

#### cURL Example

```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/period/business_hours
```

---

### 5. Get Building Summary

Gets the most recent calculation for a building (summary).

```http
GET /api/efficiency/building/{building_id}/summary
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `building_id` | string | Building ID (Valid ObjectId) |

#### Successful Response (200 OK)

Returns the most recent calculation:

```json
{
  "_id": "65a1b2c3d4e5f6789012345",
  "building_id": "60f7b3b3e4b0f3d4c8b4567a",
  "measure_name": "High-Efficiency HVAC System",
  "calculation_timestamp": "2024-01-10T12:00:00.000000",
  "periods": [...],
  "summary": {
    "total_electric_savings_kwh": 19000.0,
    "total_gas_savings_therms": 1900.0,
    "total_cost_savings": 3705.0,
    "average_efficiency_improvement_percent": 20.48,
    "overall_performance_grade": "A+ (Excellent)",
    "best_performing_period": "weekend",
    "worst_performing_period": "business_hours"
  },
  "created_at": "2024-01-10T12:00:00.000000"
}
```

#### Error Response (404 Not Found)

```json
{
  "detail": "No summary found for building ID: 60f7b3b3e4b0f3d4c8b4567a"
}
```

#### cURL Example

```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/summary
```

---

## 📐 Data Models

### CalculationRequest

```typescript
{
  building_id: string;        // Valid ObjectId - 24 characters
  measure_name: string;       // Measure name
  periods: PeriodInput[];     // Array of periods (1-10)
}
```

### PeriodInput

```typescript
{
  period: "business_hours" | "after_hours" | "weekend";
  time_range: string;         // e.g., "08:00-18:00"
  days: string[];             // Monday-Sunday
  current_electric_kwh: number;    // > 0
  current_gas_therms: number;      // > 0
  baseline_electric_kwh: number;   // > 0
  baseline_gas_therms: number;     // > 0
  electric_rate: number;           // > 0
  gas_rate: number;                // > 0
}
```

### CalculationResponse

```typescript
{
  _id: string;
  building_id: string;
  measure_name: string;
  calculation_timestamp: string;  // ISO 8601
  periods: PeriodMetrics[];
  summary: EfficiencySummary;
  created_at: string;             // ISO 8601
}
```

### PeriodMetrics

```typescript
{
  period: string;
  time_range: string;
  days: string[];
  current_electric_kwh: number;
  current_gas_therms: number;
  baseline_electric_kwh: number;
  baseline_gas_therms: number;
  electric_savings_kwh: number;
  gas_savings_therms: number;
  electric_cost_savings: number;
  gas_cost_savings: number;
  total_cost_savings: number;
  electric_efficiency_improvement_percent: number;
  gas_efficiency_improvement_percent: number;
  overall_efficiency_improvement_percent: number;
  performance_grade: string;
}
```

### EfficiencySummary

```typescript
{
  total_electric_savings_kwh: number;
  total_gas_savings_therms: number;
  total_cost_savings: number;
  average_efficiency_improvement_percent: number;
  overall_performance_grade: string;
  best_performing_period: string;
  worst_performing_period: string;
}
```

---

## 🧮 Calculation Logic

### Formulas

**Energy Savings:**
```
electric_savings = baseline_electric - current_electric
gas_savings = baseline_gas - current_gas
```

**Cost Savings:**
```
electric_cost_savings = electric_savings × electric_rate
gas_cost_savings = gas_savings × gas_rate
total_cost_savings = electric_cost_savings + gas_cost_savings
```

**Efficiency Improvement:**
```
electric_efficiency = (electric_savings / baseline_electric) × 100
gas_efficiency = (gas_savings / baseline_gas) × 100
overall_efficiency = (total_cost_savings / total_baseline_cost) × 100
```

### Grading System

| Grade | Range | Color |
|-------|-------|-------|
| A+ (Excellent) | ≥ 20% | Green |
| A (Very Good) | 15-19.99% | Light Green |
| B+ (Good) | 10-14.99% | Blue |
| B (Satisfactory) | 5-9.99% | Light Blue |
| C (Needs Improvement) | 0-4.99% | Yellow |
| D (Poor) | < 0% | Red |

---

## 🔒 Security Considerations

### In Production

1. **Authentication:** Implement API keys or JWT
2. **Rate Limiting:** Limit requests per IP
3. **HTTPS:** Secure connections only
4. **Validation:** Validate all inputs
5. **CORS:** Restrict allowed origins

### Rate Limiting Example

```python
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/efficiency/calculate")
@limiter.limit("10/minute")
async def calculate_efficiency(...):
    ...
```

---

## 📊 Limits and Quotas

| Resource | Limit |
|----------|-------|
| Periods per request | 1-10 |
| Request size | 1 MB |
| Timeout | 30 seconds |
| Rate limit (future) | 100 req/min |

---

## 🧪 Testing

### Example with Python Requests

```python
import requests

url = "http://localhost:8000/api/efficiency/calculate"
data = {
    "building_id": "60f7b3b3e4b0f3d4c8b4567a",
    "measure_name": "HVAC System",
    "periods": [...]
}

response = requests.post(url, json=data)
print(response.json())
```

### Example with JavaScript Fetch

```javascript
const response = await fetch('http://localhost:8000/api/efficiency/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

const result = await response.json();
console.log(result);
```

---

## 📝 Changelog

### Version 1.0.0 (2024-01-10)

- Initial release
- POST /api/efficiency/calculate
- GET /api/efficiency/building/{building_id}
- GET /api/efficiency/building/{building_id}/period/{period}
- GET /api/efficiency/building/{building_id}/summary
- GET /health

---

## 🤝 Support

For issues or questions:
- **GitHub Issues:** [link-to-repo/issues]
- **Email:** support@example.com
- **Docs:** http://localhost:8000/docs

---

**API Version:** 1.0.0  
**Last Updated:** 2024-01-10

