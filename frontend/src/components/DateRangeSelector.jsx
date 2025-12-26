import './FormStyles.css';

const DateRangeSelector = ({ value, onChange, disabled = false }) => {
  const options = [
    { value: '7', label: 'Last 7 days' },
    { value: '14', label: 'Last 14 days' },
    { value: '30', label: 'Last 30 days' },
  ];

  return (
    <div className="form-group">
      <label className="form-label">
        Date Range
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="form-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateRangeSelector;


