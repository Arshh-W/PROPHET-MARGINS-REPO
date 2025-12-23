const ResultsDisplay = ({ results, loading, error }) => {
  if (loading) {
    return (
      <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-4 text-primary font-medium">Analyzing data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      {results.insights && results.insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Key Insights
          </h3>
          <ul className="space-y-2">
            {results.insights.map((insight, index) => (
              <li key={index} className="flex items-start text-secondary">
                <span className="text-primary font-bold mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.summary && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(results.summary).map(([key, value]) => (
              <div key={key} className="bg-beige p-4 rounded-md">
                <p className="text-sm text-secondary capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-2xl font-bold text-primary mt-1">
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Prediction Results</h3>
          <div className="bg-primary text-beige p-6 rounded-md text-center">
            <p className="text-sm uppercase tracking-wide mb-2">Next Day Demand</p>
            <p className="text-5xl font-bold">{results.prediction.nextDay}</p>
            <p className="text-sm mt-2 opacity-90">units</p>
          </div>
          {results.confidence && (
            <p className="text-center text-secondary text-sm mt-3">
              Confidence: {(results.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
