import React, { useState, useEffect } from 'react';
import './EfficiencyDashboard.css';
import SummaryCards from './SummaryCards';
import PeriodBreakdown from './PeriodBreakdown';
import EfficiencyChart from './EfficiencyChart';
import { getBuildingSummary } from '../../services/api';

const EfficiencyDashboard = ({ buildingId, initialData }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialData) {
      loadData();
    }
  }, [buildingId, initialData]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getBuildingSummary(buildingId);
      setData(result);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error loading summary';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;

    const headers = [
      'Period',
      'Time Range',
      'Days',
      'Current Electric (kWh)',
      'Current Gas (Therms)',
      'Baseline Electric (kWh)',
      'Baseline Gas (Therms)',
      'Electric Savings (kWh)',
      'Gas Savings (Therms)',
      'Electric Cost Savings ($)',
      'Gas Cost Savings ($)',
      'Total Cost Savings ($)',
      'Electric Efficiency Improvement (%)',
      'Gas Efficiency Improvement (%)',
      'Overall Efficiency Improvement (%)',
      'Performance Grade'
    ];

    const rows = data.periods.map(period => [
      period.period,
      period.time_range,
      period.days.join(', '),
      period.current_electric_kwh,
      period.current_gas_therms,
      period.baseline_electric_kwh,
      period.baseline_gas_therms,
      period.electric_savings_kwh,
      period.gas_savings_therms,
      period.electric_cost_savings,
      period.gas_cost_savings,
      period.total_cost_savings,
      period.electric_efficiency_improvement_percent,
      period.gas_efficiency_improvement_percent,
      period.overall_efficiency_improvement_percent,
      period.performance_grade
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `efficiency_report_${buildingId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-large"></div>
        <p>Loading building data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
        <button className="btn btn-primary" onClick={loadData}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-empty">
        <p>No data available for this building.</p>
      </div>
    );
  }

  return (
    <div className="efficiency-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Energy Efficiency Dashboard</h2>
          <p className="building-info">
            <strong>Building:</strong> {data.building_id} | 
            <strong> Measure:</strong> {data.measure_name}
          </p>
          <p className="timestamp">
            Calculated: {new Date(data.calculation_timestamp).toLocaleString('en-US')}
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-secondary" onClick={exportToCSV}>
            📥 Export CSV
          </button>
          <button className="btn btn-primary" onClick={loadData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <SummaryCards summary={data.summary} />

      <div className="dashboard-section">
        <h3>📊 Efficiency Comparison by Period</h3>
        <EfficiencyChart periods={data.periods} />
      </div>

      <div className="dashboard-section">
        <h3>📋 Period Breakdown</h3>
        <PeriodBreakdown periods={data.periods} />
      </div>
    </div>
  );
};

export default EfficiencyDashboard;

