import { useState } from 'react';
import ResultsDisplay from '../components/ResultsDisplay';
import ChartPlaceholder from '../components/ChartPlaceholder';
import { predictDirect } from '../services/api';

const Mode2Form = () => {
  const [demandInput, setDemandInput] = useState('');
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
      const data = await predictDirect(values);
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-2">
            Enter past 7 days demand
          </label>
          <input
            type="text"
            value={demandInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter 7 comma-separated values"
            disabled={loading}
            className={`w-full px-3 py-2 border rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${validationError ? 'border-red-500' : 'border-secondary/30'}`}
          />
          <p className="text-xs text-secondary mt-2">
            Example: 12, 15, 14, 16, 18, 20, 22
          </p>
          {validationError && (
            <p className="text-sm text-red-600 mt-2">{validationError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || loading}
          className="w-full bg-primary text-beige py-3 px-6 rounded-md font-semibold
            hover:bg-secondary transition-colors disabled:opacity-50 
            disabled:cursor-not-allowed"
        >
          {loading ? 'Predicting...' : 'Predict Demand'}
        </button>
      </form>

      <ResultsDisplay results={results} loading={loading} error={error} />

      {results && results.prediction && results.prediction.next7Days && (
        <ChartPlaceholder
          data={results.prediction.next7Days.map((demand, index) => ({
            date: `Day ${index + 1}`,
            demand,
          }))}
          title="7-Day Demand Forecast"
        />
      )}
    </div>
  );
};

export default Mode2Form;
