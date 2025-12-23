import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import FieldMatcher from '../components/FieldMatcher';
import DateRangeSelector from '../components/DateRangeSelector';
import ChartPlaceholder from '../components/ChartPlaceholder';
import ResultsDisplay from '../components/ResultsDisplay';
import { predictByCategory } from '../services/api';

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

        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g., Electronics"
            disabled={loading}
            className="w-full px-3 py-2 border border-secondary/30 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          className="w-full bg-primary text-beige py-3 px-6 rounded-md font-semibold
            hover:bg-secondary transition-colors disabled:opacity-50 
            disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Predict Demand'}
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
