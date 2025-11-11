import React from 'react';

const SummaryCards = ({ summary }) => {
  const getGradeColor = (grade) => {
    if (grade.startsWith('A+')) return '#10b981';
    if (grade.startsWith('A')) return '#34d399';
    if (grade.startsWith('B+')) return '#60a5fa';
    if (grade.startsWith('B')) return '#93c5fd';
    if (grade.startsWith('C')) return '#fbbf24';
    return '#ef4444';
  };

  const cards = [
    {
      title: 'Total Cost Savings',
      value: `$${summary.total_cost_savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: '💰',
      color: '#10b981'
    },
    {
      title: 'Total Electric Savings',
      value: `${summary.total_electric_savings_kwh.toLocaleString('en-US')} kWh`,
      icon: '⚡',
      color: '#3b82f6'
    },
    {
      title: 'Total Gas Savings',
      value: `${summary.total_gas_savings_therms.toLocaleString('en-US')} Therms`,
      icon: '🔥',
      color: '#f59e0b'
    },
    {
      title: 'Average Efficiency Improvement',
      value: `${summary.average_efficiency_improvement_percent.toFixed(2)}%`,
      icon: '📈',
      color: '#8b5cf6'
    },
    {
      title: 'Performance Grade',
      value: summary.overall_performance_grade,
      icon: '🏆',
      color: getGradeColor(summary.overall_performance_grade),
      large: true
    }
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`summary-card ${card.large ? 'large' : ''}`}
          style={{ borderLeftColor: card.color }}
        >
          <div className="card-icon" style={{ backgroundColor: `${card.color}20` }}>
            <span style={{ fontSize: card.large ? '2.5rem' : '2rem' }}>
              {card.icon}
            </span>
          </div>
          <div className="card-content">
            <h4>{card.title}</h4>
            <p className="card-value" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        </div>
      ))}

      <div className="summary-card info-card">
        <h4>Best and Worst Performing Periods</h4>
        <div className="info-grid">
          <div>
            <span className="label">🌟 Best:</span>
            <strong>{summary.best_performing_period}</strong>
          </div>
          <div>
            <span className="label">⚠️ Worst:</span>
            <strong>{summary.worst_performing_period}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;

