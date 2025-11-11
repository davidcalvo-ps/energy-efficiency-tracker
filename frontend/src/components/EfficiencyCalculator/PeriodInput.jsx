import React from 'react';

const periodLabels = {
  business_hours: '🏢 Business Hours',
  after_hours: '🌙 After Hours',
  weekend: '🏖️ Weekend'
};

const PeriodInput = ({ period, index, onChange }) => {
  const handleChange = (field, value) => {
    onChange(index, field, value);
  };

  return (
    <div className="period-input card">
      <h4>{periodLabels[period.period]}</h4>
      <div className="period-info">
        <span className="badge">{period.time_range}</span>
        <span className="badge">{period.days.join(', ')}</span>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label>Current Electric (kWh)</label>
          <input
            type="number"
            step="0.01"
            value={period.current_electric_kwh}
            onChange={(e) => handleChange('current_electric_kwh', e.target.value)}
            placeholder="45000"
            required
          />
        </div>

        <div className="form-group">
          <label>Baseline Electric (kWh)</label>
          <input
            type="number"
            step="0.01"
            value={period.baseline_electric_kwh}
            onChange={(e) => handleChange('baseline_electric_kwh', e.target.value)}
            placeholder="52000"
            required
          />
        </div>

        <div className="form-group">
          <label>Current Gas (Therms)</label>
          <input
            type="number"
            step="0.01"
            value={period.current_gas_therms}
            onChange={(e) => handleChange('current_gas_therms', e.target.value)}
            placeholder="3200"
            required
          />
        </div>

        <div className="form-group">
          <label>Baseline Gas (Therms)</label>
          <input
            type="number"
            step="0.01"
            value={period.baseline_gas_therms}
            onChange={(e) => handleChange('baseline_gas_therms', e.target.value)}
            placeholder="4100"
            required
          />
        </div>

        <div className="form-group">
          <label>Electric Rate ($/kWh)</label>
          <input
            type="number"
            step="0.01"
            value={period.electric_rate}
            onChange={(e) => handleChange('electric_rate', e.target.value)}
            placeholder="0.12"
            required
          />
        </div>

        <div className="form-group">
          <label>Gas Rate ($/Therm)</label>
          <input
            type="number"
            step="0.01"
            value={period.gas_rate}
            onChange={(e) => handleChange('gas_rate', e.target.value)}
            placeholder="0.95"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PeriodInput;

