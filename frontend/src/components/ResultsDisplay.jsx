import './ResultsDisplay.css';

const ResultsDisplay = ({ results, loading, error }) => {
  if (loading) {
    return (
      <div className="results-loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Analyzing data with AI...</p>
        <p className="loading-subtext">This may take a few moments</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-error">
        <div className="error-icon-wrapper">
          <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="error-title">Error</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="results-container">
      {results.insights && results.insights.length > 0 && (
        <div className="results-card insights-card">
          <div className="card-header">
            <div className="card-icon insights-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="card-title">Key Insights</h3>
          </div>
          <ul className="insights-list">
            {results.insights.map((insight, index) => (
              <li key={index} className="insight-item">
                <span className="insight-bullet">✨</span>
                <span className="insight-text">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.summary && (
        <div className="results-card summary-card">
          <div className="card-header">
            <div className="card-icon summary-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="card-title">Summary Statistics</h3>
          </div>
          <div className="summary-grid">
            {Object.entries(results.summary).map(([key, value]) => (
              <div key={key} className="summary-item">
                <p className="summary-label">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="summary-value">
                  {typeof value === 'number' 
                    ? value < 1 
                      ? (value * 100).toFixed(0) + '%'
                      : value.toLocaleString()
                    : value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.prediction && (
        <div className="results-card prediction-card">
          <div className="card-header">
            <div className="card-icon prediction-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="card-title">Prediction Results</h3>
          </div>
          <div className="prediction-display">
            <p className="prediction-label">Next Day Demand</p>
            <p className="prediction-value">{results.prediction.nextDay}</p>
            <p className="prediction-unit">units</p>
          </div>
          {results.confidence && (
            <div className="confidence-badge">
              <span className="confidence-label">Confidence:</span>
              <span className="confidence-value">{(results.confidence * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
