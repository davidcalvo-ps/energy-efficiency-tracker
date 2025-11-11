import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const periodLabels = {
  business_hours: 'Business Hours',
  after_hours: 'After Hours',
  weekend: 'Weekend'
};

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

const EfficiencyChart = ({ periods }) => {
  const [chartType, setChartType] = useState('bar');

  const barChartData = periods.map(period => ({
    name: periodLabels[period.period],
    'Electric Improvement (%)': period.electric_efficiency_improvement_percent,
    'Gas Improvement (%)': period.gas_efficiency_improvement_percent,
    'Overall Improvement (%)': period.overall_efficiency_improvement_percent
  }));

  const pieChartData = periods.map((period, index) => ({
    name: periodLabels[period.period],
    value: period.total_cost_savings,
    color: COLORS[index]
  }));

  const lineChartData = periods.map(period => ({
    name: periodLabels[period.period],
    'Electric Savings (kWh)': period.electric_savings_kwh,
    'Gas Savings (Therms)': period.gas_savings_therms,
    'Cost Savings ($)': period.total_cost_savings
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' 
                ? entry.value.toFixed(2) + (entry.name.includes('$') ? '' : '%')
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color }}>
            Savings: ${payload[0].value.toLocaleString('en-US', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Improvement (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Electric Improvement (%)" fill="#3b82f6" />
              <Bar dataKey="Gas Improvement (%)" fill="#f59e0b" />
              <Bar dataKey="Overall Improvement (%)" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="Electric Savings (kWh)" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Gas Savings (Therms)" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="Cost Savings ($)" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="efficiency-charts">
      <div className="chart-controls">
        <div className="chart-type-toggle">
          <button
            className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            📊 Bar
          </button>
          <button
            className={`chart-type-btn ${chartType === 'pie' ? 'active' : ''}`}
            onClick={() => setChartType('pie')}
          >
            🥧 Pie
          </button>
          <button
            className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
          >
            📈 Line
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        {chartType === 'bar' && <h4>Efficiency Improvements Comparison</h4>}
        {chartType === 'pie' && <h4>Cost Savings Distribution</h4>}
        {chartType === 'line' && <h4>Savings Trends</h4>}
        {renderChart()}
      </div>
    </div>
  );
};

export default EfficiencyChart;

