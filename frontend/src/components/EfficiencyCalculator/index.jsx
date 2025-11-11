import React, { useState } from 'react';
import './EfficiencyCalculator.css';
import CalculatorForm from './CalculatorForm';
import PeriodInput from './PeriodInput';
import { calculateEfficiency } from '../../services/api';

const EfficiencyCalculator = ({ onCalculationComplete }) => {
  const [buildingId, setBuildingId] = useState('');
  const [measureName, setMeasureName] = useState('');
  const [periods, setPeriods] = useState([
    {
      period: 'business_hours',
      time_range: '08:00-18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      current_electric_kwh: '',
      current_gas_therms: '',
      baseline_electric_kwh: '',
      baseline_gas_therms: '',
      electric_rate: '0.12',
      gas_rate: '0.95'
    },
    {
      period: 'after_hours',
      time_range: '18:00-08:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      current_electric_kwh: '',
      current_gas_therms: '',
      baseline_electric_kwh: '',
      baseline_gas_therms: '',
      electric_rate: '0.08',
      gas_rate: '0.95'
    },
    {
      period: 'weekend',
      time_range: '00:00-24:00',
      days: ['Saturday', 'Sunday'],
      current_electric_kwh: '',
      current_gas_therms: '',
      baseline_electric_kwh: '',
      baseline_gas_therms: '',
      electric_rate: '0.10',
      gas_rate: '0.95'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const loadSampleData = () => {
    setBuildingId('60f7b3b3e4b0f3d4c8b4567a');
    setMeasureName('High-Efficiency HVAC System');
    setPeriods([
      {
        period: 'business_hours',
        time_range: '08:00-18:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        current_electric_kwh: '45000',
        current_gas_therms: '3200',
        baseline_electric_kwh: '52000',
        baseline_gas_therms: '4100',
        electric_rate: '0.12',
        gas_rate: '0.95'
      },
      {
        period: 'after_hours',
        time_range: '18:00-08:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        current_electric_kwh: '28000',
        current_gas_therms: '2200',
        baseline_electric_kwh: '35000',
        baseline_gas_therms: '2800',
        electric_rate: '0.08',
        gas_rate: '0.95'
      },
      {
        period: 'weekend',
        time_range: '00:00-24:00',
        days: ['Saturday', 'Sunday'],
        current_electric_kwh: '15000',
        current_gas_therms: '1200',
        baseline_electric_kwh: '20000',
        baseline_gas_therms: '1600',
        electric_rate: '0.10',
        gas_rate: '0.95'
      }
    ]);
  };

  const handlePeriodChange = (index, field, value) => {
    const updatedPeriods = [...periods];
    updatedPeriods[index][field] = value;
    setPeriods(updatedPeriods);
  };

  const validateForm = () => {
    if (!buildingId.trim()) {
      setError('Building ID is required');
      return false;
    }

    if (!measureName.trim()) {
      setError('Measure name is required');
      return false;
    }

    for (let i = 0; i < periods.length; i++) {
      const period = periods[i];
      if (!period.current_electric_kwh || parseFloat(period.current_electric_kwh) <= 0) {
        setError(`Invalid current electric consumption for period ${period.period}`);
        return false;
      }
      if (!period.baseline_electric_kwh || parseFloat(period.baseline_electric_kwh) <= 0) {
        setError(`Invalid baseline electric consumption for period ${period.period}`);
        return false;
      }
      if (!period.current_gas_therms || parseFloat(period.current_gas_therms) <= 0) {
        setError(`Invalid current gas consumption for period ${period.period}`);
        return false;
      }
      if (!period.baseline_gas_therms || parseFloat(period.baseline_gas_therms) <= 0) {
        setError(`Invalid baseline gas consumption for period ${period.period}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Convert string values to numbers
      const formattedPeriods = periods.map(period => ({
        ...period,
        current_electric_kwh: parseFloat(period.current_electric_kwh),
        current_gas_therms: parseFloat(period.current_gas_therms),
        baseline_electric_kwh: parseFloat(period.baseline_electric_kwh),
        baseline_gas_therms: parseFloat(period.baseline_gas_therms),
        electric_rate: parseFloat(period.electric_rate),
        gas_rate: parseFloat(period.gas_rate)
      }));

      const requestData = {
        building_id: buildingId,
        measure_name: measureName,
        periods: formattedPeriods
      };

      const result = await calculateEfficiency(requestData);
      setSuccess(true);
      
      // Notify parent component
      if (onCalculationComplete) {
        onCalculationComplete(result);
      }

    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error calculating efficiency';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="efficiency-calculator">
      <div className="calculator-header">
        <h2>Calculate Energy Efficiency</h2>
        <p>Enter consumption data to calculate savings and energy efficiency</p>
        <button 
          type="button" 
          className="btn-sample-data"
          onClick={loadSampleData}
        >
          📋 Load Sample Data
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <strong>Success!</strong> Calculation completed successfully.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <CalculatorForm
          buildingId={buildingId}
          setBuildingId={setBuildingId}
          measureName={measureName}
          setMeasureName={setMeasureName}
        />

        <div className="periods-container">
          <h3>Operational Periods</h3>
          <div className="periods-grid">
            {periods.map((period, index) => (
              <PeriodInput
                key={period.period}
                period={period}
                index={index}
                onChange={handlePeriodChange}
              />
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                Calculating...
              </>
            ) : (
              '🚀 Calculate Efficiency'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EfficiencyCalculator;

