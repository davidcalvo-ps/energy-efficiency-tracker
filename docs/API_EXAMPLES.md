# API Examples

Practical usage examples for the Energy Efficiency Tracker API.

## 📋 Table of Contents

1. [Initial Configuration](#initial-configuration)
2. [Calculate Efficiency](#calculate-efficiency)
3. [Query Data](#query-data)
4. [Common Use Cases](#common-use-cases)
5. [Examples with Different Languages](#examples-with-different-languages)

---

## ⚙️ Initial Configuration

### Environment Variables

```bash
export API_URL="http://localhost:8000"
```

### Verify Connection

```bash
curl $API_URL/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-10T12:00:00"
}
```

---

## 📊 Calculate Efficiency

### Example 1: Office Building with Improved HVAC

```bash
curl -X POST http://localhost:8000/api/efficiency/calculate \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Example 2: Shopping Mall with LED Lighting

```bash
curl -X POST http://localhost:8000/api/efficiency/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "building_id": "60f7b3b3e4b0f3d4c8b4567b",
    "measure_name": "LED Lighting Upgrade",
    "periods": [
      {
        "period": "business_hours",
        "time_range": "10:00-22:00",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "current_electric_kwh": 35000,
        "current_gas_therms": 1500,
        "baseline_electric_kwh": 55000,
        "baseline_gas_therms": 1500,
        "electric_rate": 0.15,
        "gas_rate": 1.00
      },
      {
        "period": "after_hours",
        "time_range": "22:00-10:00",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "current_electric_kwh": 8000,
        "current_gas_therms": 800,
        "baseline_electric_kwh": 15000,
        "baseline_gas_therms": 800,
        "electric_rate": 0.10,
        "gas_rate": 1.00
      }
    ]
  }'
```

### Example 3: Industrial Warehouse with Cooling System

```bash
curl -X POST http://localhost:8000/api/efficiency/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "building_id": "60f7b3b3e4b0f3d4c8b4567c",
    "measure_name": "High-Efficiency Cooling System",
    "periods": [
      {
        "period": "business_hours",
        "time_range": "06:00-18:00",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "current_electric_kwh": 85000,
        "current_gas_therms": 500,
        "baseline_electric_kwh": 120000,
        "baseline_gas_therms": 500,
        "electric_rate": 0.10,
        "gas_rate": 0.90
      },
      {
        "period": "after_hours",
        "time_range": "18:00-06:00",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "current_electric_kwh": 65000,
        "current_gas_therms": 300,
        "baseline_electric_kwh": 95000,
        "baseline_gas_therms": 300,
        "electric_rate": 0.08,
        "gas_rate": 0.90
      },
      {
        "period": "weekend",
        "time_range": "00:00-24:00",
        "days": ["Saturday", "Sunday"],
        "current_electric_kwh": 45000,
        "current_gas_therms": 200,
        "baseline_electric_kwh": 70000,
        "baseline_gas_therms": 200,
        "electric_rate": 0.09,
        "gas_rate": 0.90
      }
    ]
  }'
```

---

## 🔍 Query Data

### Get All Calculations for a Building

```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a
```

### Get Business Hours Calculations

```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/period/business_hours
```

### Get After Hours Calculations

```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/period/after_hours
```

### Get Weekend Calculations

```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/period/weekend
```

### Get Most Recent Summary

```bash
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/summary
```

---

## 💡 Common Use Cases

### Case 1: Compare Before and After Improvements

```bash
# 1. Calculate baseline (before improvement)
curl -X POST http://localhost:8000/api/efficiency/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "building_id": "60f7b3b3e4b0f3d4c8b4567d",
    "measure_name": "Pre-Upgrade Baseline",
    "periods": [...]
  }'

# 2. Calculate after improvement
curl -X POST http://localhost:8000/api/efficiency/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "building_id": "60f7b3b3e4b0f3d4c8b4567d",
    "measure_name": "Post-Upgrade Performance",
    "periods": [...]
  }'

# 3. Compare results
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567d
```

### Case 2: Period Analysis

```bash
# Get only business hours data
curl http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/period/business_hours \
  | jq '.[] | .periods[0] | {period, total_cost_savings, performance_grade}'
```

### Case 3: Multiple Buildings Monitoring

```bash
# Script to get summary for multiple buildings
for building_id in 60f7b3b3e4b0f3d4c8b4567a 60f7b3b3e4b0f3d4c8b4567b 60f7b3b3e4b0f3d4c8b4567c
do
  echo "Building: $building_id"
  curl -s http://localhost:8000/api/efficiency/building/$building_id/summary \
    | jq '.summary | {total_cost_savings, overall_performance_grade}'
  echo ""
done
```

---

## 🔧 Examples with Different Languages

### Python with Requests

```python
import requests
import json

API_URL = "http://localhost:8000"

# Calcular eficiencia
def calculate_efficiency():
    data = {
        "building_id": "60f7b3b3e4b0f3d4c8b4567a",
        "measure_name": "HVAC Upgrade",
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
    
    response = requests.post(
        f"{API_URL}/api/efficiency/calculate",
        json=data
    )
    
    if response.status_code == 201:
        result = response.json()
        print(f"✅ Calculation successful!")
        print(f"Total Cost Savings: ${result['summary']['total_cost_savings']}")
        print(f"Grade: {result['summary']['overall_performance_grade']}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.json())

# Get summary
def get_summary(building_id):
    response = requests.get(
        f"{API_URL}/api/efficiency/building/{building_id}/summary"
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"❌ Error: {response.status_code}")
        return None

# Execute
if __name__ == "__main__":
    calculate_efficiency()
    
    summary = get_summary("60f7b3b3e4b0f3d4c8b4567a")
    if summary:
        print(json.dumps(summary['summary'], indent=2))
```

### JavaScript con Axios

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:8000';

// Calculate efficiency
async function calculateEfficiency() {
  try {
    const response = await axios.post(
      `${API_URL}/api/efficiency/calculate`,
      {
        building_id: '60f7b3b3e4b0f3d4c8b4567a',
        measure_name: 'HVAC Upgrade',
        periods: [
          {
            period: 'business_hours',
            time_range: '08:00-18:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            current_electric_kwh: 45000,
            current_gas_therms: 3200,
            baseline_electric_kwh: 52000,
            baseline_gas_therms: 4100,
            electric_rate: 0.12,
            gas_rate: 0.95
          }
        ]
      }
    );
    
    console.log('✅ Calculation successful!');
    console.log(`Total Cost Savings: $${response.data.summary.total_cost_savings}`);
    console.log(`Grade: ${response.data.summary.overall_performance_grade}`);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Get summary
async function getSummary(buildingId) {
  try {
    const response = await axios.get(
      `${API_URL}/api/efficiency/building/${buildingId}/summary`
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return null;
  }
}

// Execute
(async () => {
  await calculateEfficiency();
  
  const summary = await getSummary('60f7b3b3e4b0f3d4c8b4567a');
  if (summary) {
    console.log(JSON.stringify(summary.summary, null, 2));
  }
})();
```

### JavaScript con Fetch (Navegador)

```javascript
const API_URL = 'http://localhost:8000';

// Calculate efficiency
async function calculateEfficiency() {
  try {
    const response = await fetch(`${API_URL}/api/efficiency/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        building_id: '60f7b3b3e4b0f3d4c8b4567a',
        measure_name: 'HVAC Upgrade',
        periods: [...]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Success:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Get summary
async function getSummary(buildingId) {
  try {
    const response = await fetch(
      `${API_URL}/api/efficiency/building/${buildingId}/summary`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}
```

### PowerShell (Windows)

```powershell
$API_URL = "http://localhost:8000"

# Calcular eficiencia
$body = @{
    building_id = "60f7b3b3e4b0f3d4c8b4567a"
    measure_name = "HVAC Upgrade"
    periods = @(
        @{
            period = "business_hours"
            time_range = "08:00-18:00"
            days = @("Monday", "Tuesday", "Wednesday", "Thursday", "Friday")
            current_electric_kwh = 45000
            current_gas_therms = 3200
            baseline_electric_kwh = 52000
            baseline_gas_therms = 4100
            electric_rate = 0.12
            gas_rate = 0.95
        }
    )
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod `
    -Uri "$API_URL/api/efficiency/calculate" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

Write-Host "✅ Calculation successful!"
Write-Host "Total Cost Savings: $($response.summary.total_cost_savings)"
Write-Host "Grade: $($response.summary.overall_performance_grade)"

# Get summary
$summary = Invoke-RestMethod `
    -Uri "$API_URL/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/summary" `
    -Method Get

$summary.summary | ConvertTo-Json
```

---

## 📊 Results Analysis

### Extract Key Metrics with jq

```bash
# Total savings
curl -s http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/summary \
  | jq '.summary.total_cost_savings'

# Grade
curl -s http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/summary \
  | jq -r '.summary.overall_performance_grade'

# Best period
curl -s http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/summary \
  | jq -r '.summary.best_performing_period'

# Savings by period
curl -s http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/summary \
  | jq '.periods[] | {period: .period, savings: .total_cost_savings, grade: .performance_grade}'
```

### Export to CSV

```bash
# Export summary to CSV
curl -s http://localhost:8000/api/efficiency/building/60f7b3b3e4b0f3d4c8b4567a/summary \
  | jq -r '.periods[] | [.period, .electric_savings_kwh, .gas_savings_therms, .total_cost_savings, .overall_efficiency_improvement_percent, .performance_grade] | @csv' \
  > efficiency_report.csv
```

---

## 🔄 Automation

### Continuous Monitoring Script

```bash
#!/bin/bash
# monitor.sh

BUILDING_ID="60f7b3b3e4b0f3d4c8b4567a"
API_URL="http://localhost:8000"

while true; do
  echo "=== $(date) ==="
  
  SUMMARY=$(curl -s "$API_URL/api/efficiency/building/$BUILDING_ID/summary")
  
  SAVINGS=$(echo $SUMMARY | jq -r '.summary.total_cost_savings')
  GRADE=$(echo $SUMMARY | jq -r '.summary.overall_performance_grade')
  
  echo "Total Savings: \$$SAVINGS"
  echo "Grade: $GRADE"
  echo ""
  
  sleep 3600  # Every hour
done
```

### Cron Job for Periodic Calculations

```bash
# Add to crontab (crontab -e)

# Calculate efficiency daily at 2 AM
0 2 * * * /path/to/calculate_efficiency.sh

# Generate weekly report on Mondays at 8 AM
0 8 * * 1 /path/to/generate_weekly_report.sh
```

---

## 📝 Notes

- All examples assume the API is running on `localhost:8000`
- `building_id` values must be valid MongoDB ObjectIds (24 hex characters)
- Responses are in JSON format
- Timestamps are in UTC

---

## 🤝 Contributing

Have more useful examples? Add them to this document!

**Last Updated:** 2024-01-10

