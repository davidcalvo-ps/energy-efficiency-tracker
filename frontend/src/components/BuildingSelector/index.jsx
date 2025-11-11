import React, { useState } from 'react';
import './BuildingSelector.css';

const BuildingSelector = ({ onBuildingSelect }) => {
  const [buildingId, setBuildingId] = useState('');
  const [error, setError] = useState('');

  // Sample building IDs for quick selection
  const sampleBuildings = [
    {
      id: '60f7b3b3e4b0f3d4c8b4567a',
      name: 'Office Building - HVAC System',
      description: 'Main office building with HVAC upgrade'
    },
    {
      id: '60f7b3b3e4b0f3d4c8b4567b',
      name: 'Shopping Mall - LED Lighting',
      description: 'Shopping mall with LED lighting system'
    },
    {
      id: '60f7b3b3e4b0f3d4c8b4567c',
      name: 'Industrial Warehouse - Cooling System',
      description: 'Warehouse with improved cooling system'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!buildingId.trim()) {
      setError('Please enter a building ID');
      return;
    }

    // Basic ObjectId validation (24 hex characters)
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(buildingId.trim())) {
      setError('ID must be a valid MongoDB ObjectId (24 hexadecimal characters)');
      return;
    }

    onBuildingSelect(buildingId.trim());
  };

  const handleSampleSelect = (id) => {
    setBuildingId(id);
    setError('');
  };

  return (
    <div className="building-selector">
      <div className="selector-header">
        <h2>Select Building</h2>
        <p>Enter a building ID to view its energy efficiency information</p>
      </div>

      <div className="selector-content card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="buildingId">
              Building ID <span className="required">*</span>
            </label>
            <div className="input-with-button">
              <input
                id="buildingId"
                type="text"
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                placeholder="e.g., 60f7b3b3e4b0f3d4c8b4567a"
                required
              />
              <button type="submit" className="btn btn-primary">
                🔍 Search
              </button>
            </div>
            <small>Format: MongoDB ObjectId (24 characters)</small>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
        </form>
      </div>

      <div className="sample-buildings">
        <h3>Sample Buildings</h3>
        <p className="subtitle">Click on one of the following buildings to view it</p>
        
        <div className="buildings-grid">
          {sampleBuildings.map((building) => (
            <div 
              key={building.id} 
              className="building-card"
              onClick={() => handleSampleSelect(building.id)}
            >
              <div className="building-icon">🏢</div>
              <div className="building-info">
                <h4>{building.name}</h4>
                <p>{building.description}</p>
                <code className="building-id">{building.id}</code>
              </div>
              <button 
                className="btn-select"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSampleSelect(building.id);
                  onBuildingSelect(building.id);
                }}
              >
                View →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section card">
        <h3>ℹ️ Information</h3>
        <ul>
          <li>
            <strong>How to use:</strong> Enter a valid building ID or select one of the examples.
          </li>
          <li>
            <strong>ID Format:</strong> Building IDs must be valid MongoDB ObjectIds (24 hexadecimal characters).
          </li>
          <li>
            <strong>Note:</strong> If there's no data for a building, you must calculate it first using the "Calculate Efficiency" section.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BuildingSelector;

