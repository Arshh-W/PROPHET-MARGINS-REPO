import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import FieldMatcher from '../components/FieldMatcher';
import DateRangeSelector from '../components/DateRangeSelector';
import ChartPlaceholder from '../components/ChartPlaceholder';
import { analyzeAllCategories } from '../services/api';

const Mode3Form = () => {
  const [file, setFile] = useState(null);
  const [fieldMatcher, setFieldMatcher] = useState({
    demandColumn: '',
    categoryColumn: '',
    dateColumn: '',
  });
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const isFormValid = () => {
    return (
      file &&
      fieldMatcher.demandColumn.trim() &&
      fieldMatcher.categoryColumn.trim() &&
      fieldMatcher.dateColumn.trim()
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
      formData.append('dateRange', dateRange);

      const data = await analyzeAllCategories(formData);
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
          {loading ? 'Analyzing...' : 'Analyze All Categories'}
        </button>
      </form>

      {loading && (
        <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-4 text-primary font-medium">Analyzing all categories...</span>
          </div>
        </div>
      )}

      {error && (
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
      )}

      {results && (
        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overall Insights
            </h3>
            <div className="mb-4">
              <p className="text-secondary">
                <span className="font-semibold text-primary">Total Categories:</span> {results.totalCategories}
              </p>
              <p className="text-secondary">
                <span className="font-semibold text-primary">Date Range:</span> Last {results.dateRange} days
              </p>
            </div>
            <ul className="space-y-2">
              {results.overallInsights?.map((insight, index) => (
                <li key={index} className="flex items-start text-secondary">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.categories?.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-primary">{category.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    category.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                    category.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {category.trend}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-secondary">Total Demand</p>
                    <p className="text-2xl font-bold text-primary">{category.totalDemand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary">Avg Demand</p>
                    <p className="text-2xl font-bold text-primary">{category.averageDemand}</p>
                  </div>
                </div>

                {category.predictions && category.predictions.length > 0 && (
                  <ChartPlaceholder
                    data={category.predictions}
                    title={`${category.name} Forecast`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Mode3Form;
