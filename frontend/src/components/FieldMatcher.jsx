import './FormStyles.css';

const FieldMatcher = ({ values, onChange, disabled = false }) => {
  const handleChange = (field, value) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <div className="mb-6">
      <h3 className="form-label text-lg mb-4">Field Matcher</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-group">
          <label className="form-label">
            Demand Column Name
          </label>
          <input
            type="text"
            value={values.demandColumn || ''}
            onChange={(e) => handleChange('demandColumn', e.target.value)}
            placeholder="e.g., demand"
            disabled={disabled}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Category Column Name
          </label>
          <input
            type="text"
            value={values.categoryColumn || ''}
            onChange={(e) => handleChange('categoryColumn', e.target.value)}
            placeholder="e.g., category"
            disabled={disabled}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Date Column Name
          </label>
          <input
            type="text"
            value={values.dateColumn || ''}
            onChange={(e) => handleChange('dateColumn', e.target.value)}
            placeholder="e.g., date"
            disabled={disabled}
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default FieldMatcher;


