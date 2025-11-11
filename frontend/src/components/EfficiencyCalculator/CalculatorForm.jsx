import React from 'react';

const CalculatorForm = ({ buildingId, setBuildingId, measureName, setMeasureName }) => {
  return (
    <div className="calculator-form card">
      <h3>Building Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="buildingId">
            Building ID <span className="required">*</span>
          </label>
          <input
            id="buildingId"
            type="text"
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
            placeholder="e.g., 60f7b3b3e4b0f3d4c8b4567a"
            required
          />
          <small>Valid MongoDB ObjectId (24 hexadecimal characters)</small>
        </div>

        <div className="form-group">
          <label htmlFor="measureName">
            Measure Name <span className="required">*</span>
          </label>
          <input
            id="measureName"
            type="text"
            value={measureName}
            onChange={(e) => setMeasureName(e.target.value)}
            placeholder="e.g., High-Efficiency HVAC System"
            required
          />
          <small>Description of the implemented efficiency improvement</small>
        </div>
      </div>
    </div>
  );
};

export default CalculatorForm;

