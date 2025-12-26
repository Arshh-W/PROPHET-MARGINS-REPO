import { useState } from 'react';
import ResultsDisplay from './ResultsDisplay';
import ChartPlaceholder from './ChartPlaceholder';
import { predictDirect } from '../services/api';
import './FormStyles.css';

const Mode2Form = () => {
  const [demandInput, setDemandInput] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [results, setResults] = useState(null);

  const validateInput = (input) => {
    if (!input.trim()) {
      return 'Please enter demand values';
    }

    const values = input.split(',').map(v => v.trim());
    
    if (values.length !== 7) {
      return 'Please enter exactly 7 values';
    }

    const numbers = values.map(v => parseFloat(v));
    if (numbers.some(n => isNaN(n) || n < 0)) {
      return 'All values must be valid positive numbers';
    }

    return null;
  };

  const handleInputChange = (value) => {
    setDemandInput(value);
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateInput(demandInput);
    if (validation) {
      setValidationError(validation);
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const values = demandInput.split(',').map(v => parseFloat(v.trim()));
      const data = await predictDirect(values, startDate);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return demandInput.trim() && !validationError;
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label className="form-label">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Enter past 7 days demand
          </label>
          <input
            type="text"
            value={demandInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter 7 comma-separated values"
            disabled={loading}
            className={`form-input ${validationError ? 'border-red-500' : ''}`}
          />
          <p className="form-help-text">
            Example: 12, 15, 14, 16, 18, 20, 22
          </p>
          {validationError && (
            <div className="form-error">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {validationError}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || loading}
          className="form-button"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Predicting...
            </>
          ) : (
            <>
              Predict Demand
              <span>→</span>
            </>
          )}
        </button>
      </form>

      <ResultsDisplay results={results} loading={loading} error={error} />

      {results && results.prediction && results.prediction.next7Days && results.prediction.next7Days.length > 0 && (
        <ChartPlaceholder
          data={results.prediction.next7Days.map((demand, index) => {
            const demandNum = typeof demand === 'number' ? demand : parseFloat(demand) || 0;
            return {
              date: `Day ${index + 1}`,
              demand: demandNum,
            };
          })}
          title="7-Day Demand Forecast"
        />
      )}
    </div>
  );
};

export default Mode2Form;


