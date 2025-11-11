import React from 'react';

const periodLabels = {
  business_hours: '🏢 Business Hours',
  after_hours: '🌙 After Hours',
  weekend: '🏖️ Weekend'
};

const getPerformanceClass = (grade) => {
  if (grade.startsWith('A+') || grade.startsWith('A')) return 'excellent';
  if (grade.startsWith('B+') || grade.startsWith('B')) return 'good';
  if (grade.startsWith('C')) return 'needs-improvement';
  return 'poor';
};

const PeriodBreakdown = ({ periods }) => {
  return (
    <div className="period-breakdown">
      {periods.map((period, index) => (
        <div 
          key={index} 
          className={`period-card ${getPerformanceClass(period.performance_grade)}`}
        >
          <div className="period-header">
            <h4>{periodLabels[period.period]}</h4>
            <span className="performance-badge">
              {period.performance_grade}
            </span>
          </div>

          <div className="period-info-row">
            <span className="info-label">Schedule:</span>
            <span>{period.time_range}</span>
          </div>
          <div className="period-info-row">
            <span className="info-label">Days:</span>
            <span>{period.days.join(', ')}</span>
          </div>

          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">⚡ Electric Savings</span>
              <span className="metric-value">
                {period.electric_savings_kwh.toLocaleString('en-US')} kWh
              </span>
              <span className="metric-percent">
                {period.electric_efficiency_improvement_percent.toFixed(2)}% improvement
              </span>
            </div>

            <div className="metric">
              <span className="metric-label">🔥 Gas Savings</span>
              <span className="metric-value">
                {period.gas_savings_therms.toLocaleString('en-US')} Therms
              </span>
              <span className="metric-percent">
                {period.gas_efficiency_improvement_percent.toFixed(2)}% improvement
              </span>
            </div>

            <div className="metric">
              <span className="metric-label">💰 Cost Savings</span>
              <span className="metric-value highlight">
                ${period.total_cost_savings.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>

            <div className="metric">
              <span className="metric-label">📊 Overall Efficiency</span>
              <span className="metric-value highlight">
                {period.overall_efficiency_improvement_percent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="consumption-comparison">
            <div className="comparison-section">
              <h5>Electric Consumption</h5>
              <div className="comparison-bars">
                <div className="bar-item">
                  <span>Baseline: {period.baseline_electric_kwh.toLocaleString('en-US')} kWh</span>
                  <div className="bar baseline" style={{ width: '100%' }}></div>
                </div>
                <div className="bar-item">
                  <span>Current: {period.current_electric_kwh.toLocaleString('en-US')} kWh</span>
                  <div 
                    className="bar current" 
                    style={{ 
                      width: `${(period.current_electric_kwh / period.baseline_electric_kwh) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="comparison-section">
              <h5>Gas Consumption</h5>
              <div className="comparison-bars">
                <div className="bar-item">
                  <span>Baseline: {period.baseline_gas_therms.toLocaleString('en-US')} Therms</span>
                  <div className="bar baseline" style={{ width: '100%' }}></div>
                </div>
                <div className="bar-item">
                  <span>Current: {period.current_gas_therms.toLocaleString('en-US')} Therms</span>
                  <div 
                    className="bar current" 
                    style={{ 
                      width: `${(period.current_gas_therms / period.baseline_gas_therms) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PeriodBreakdown;

