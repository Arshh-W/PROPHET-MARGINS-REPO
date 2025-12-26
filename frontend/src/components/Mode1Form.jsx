import { useState } from 'react';
import FileUpload from './FileUpload';
import FieldMatcher from './FieldMatcher';
import DateRangeSelector from './DateRangeSelector';
import ChartPlaceholder from './ChartPlaceholder';
import ResultsDisplay from './ResultsDisplay';
import { predictByCategory } from '../services/api';
import './FormStyles.css';

const Mode1Form = () => {
  const [file, setFile] = useState(null);
  const [fieldMatcher, setFieldMatcher] = useState({
    demandColumn: '',
    categoryColumn: '',
    dateColumn: '',
  });
  const [categoryName, setCategoryName] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const isFormValid = () => {
    return (
      file &&
      fieldMatcher.demandColumn.trim() &&
      fieldMatcher.categoryColumn.trim() &&
      fieldMatcher.dateColumn.trim() &&
      categoryName.trim()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('option', '1');
      formData.append('demandColumn', fieldMatcher.demandColumn);
      formData.append('categoryColumn', fieldMatcher.categoryColumn);
      formData.append('dateColumn', fieldMatcher.dateColumn);
      formData.append('categoryName', categoryName);
      formData.append('dateRange', dateRange);

      const data = await predictByCategory(formData);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FileUpload onFileSelect={setFile} disabled={loading} />
        
        <FieldMatcher
          values={fieldMatcher}
          onChange={setFieldMatcher}
          disabled={loading}
        />

        <div className="form-group">
          <label className="form-label">
            Category Name
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g., Electronics"
            disabled={loading}
            className="form-input"
          />
        </div>

        <DateRangeSelector
          value={dateRange}
          onChange={setDateRange}
          disabled={loading}
        />

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
              Analyzing...
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

      {results && results.predictions && (
        <ChartPlaceholder
          data={results.predictions}
          title={`Demand Forecast for ${categoryName}`}
        />
      )}
    </div>
  );
};

export default Mode1Form;


