import React, { useState, useEffect } from 'react';
import './App.css';
import { checkHealth } from './services/api';
import EfficiencyCalculator from './components/EfficiencyCalculator';
import EfficiencyDashboard from './components/EfficiencyDashboard';
import BuildingSelector from './components/BuildingSelector';

function App() {
  const [activeView, setActiveView] = useState('calculator');
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [latestCalculation, setLatestCalculation] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await checkHealth();
        setApiStatus('connected');
      } catch (error) {
        setApiStatus('disconnected');
      }
    };
    checkApiHealth();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleCalculationComplete = (result) => {
    setLatestCalculation(result);
    setSelectedBuildingId(result.building_id);
    setActiveView('dashboard');
  };

  const handleBuildingSelect = (buildingId) => {
    setSelectedBuildingId(buildingId);
    setActiveView('dashboard');
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>⚡ Energy Efficiency Tracker</h1>
              <p className="subtitle">Building Energy Efficiency Monitoring System</p>
            </div>
            <div className="header-actions">
              <div className="api-status">
                <span className={`status-indicator ${apiStatus}`}></span>
                <span>
                  API: {apiStatus === 'checking' ? 'Checking...' : 
                        apiStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                className="dark-mode-toggle"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container">
          <button
            className={`nav-button ${activeView === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveView('calculator')}
          >
            📊 Calculate Efficiency
          </button>
          <button
            className={`nav-button ${activeView === 'selector' ? 'active' : ''}`}
            onClick={() => setActiveView('selector')}
          >
            🏢 View Buildings
          </button>
          {selectedBuildingId && (
            <button
              className={`nav-button ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              📈 Dashboard
            </button>
          )}
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          {activeView === 'calculator' && (
            <EfficiencyCalculator onCalculationComplete={handleCalculationComplete} />
          )}
          
          {activeView === 'selector' && (
            <BuildingSelector onBuildingSelect={handleBuildingSelect} />
          )}
          
          {activeView === 'dashboard' && selectedBuildingId && (
            <EfficiencyDashboard 
              buildingId={selectedBuildingId}
              initialData={latestCalculation}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>© 2025 Energy Efficiency Tracker | Built with FastAPI + React + MongoDB</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

