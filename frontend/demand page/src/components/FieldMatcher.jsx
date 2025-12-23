const FieldMatcher = ({ values, onChange, disabled = false }) => {
  const handleChange = (field, value) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <div className="mb-6">
      <h3 className="text-primary font-semibold mb-3">Field Matcher</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            Demand Column Name
          </label>
          <input
            type="text"
            value={values.demandColumn || ''}
            onChange={(e) => handleChange('demandColumn', e.target.value)}
            placeholder="e.g., demand"
            disabled={disabled}
            className="w-full px-3 py-2 border border-secondary/30 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            Category Column Name
          </label>
          <input
            type="text"
            value={values.categoryColumn || ''}
            onChange={(e) => handleChange('categoryColumn', e.target.value)}
            placeholder="e.g., category"
            disabled={disabled}
            className="w-full px-3 py-2 border border-secondary/30 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            Date Column Name
          </label>
          <input
            type="text"
            value={values.dateColumn || ''}
            onChange={(e) => handleChange('dateColumn', e.target.value)}
            placeholder="e.g., date"
            disabled={disabled}
            className="w-full px-3 py-2 border border-secondary/30 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default FieldMatcher;
