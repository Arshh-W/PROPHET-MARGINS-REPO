const ChartPlaceholder = ({ data, title = 'Demand Prediction Chart' }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate min and max for scaling
  const values = data.map(d => d.demand);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
      <div className="relative h-64 border-l-2 border-b-2 border-secondary/30">
        <div className="absolute -left-12 top-0 text-xs text-secondary">
          {maxValue}
        </div>
        <div className="absolute -left-12 bottom-0 text-xs text-secondary">
          {minValue}
        </div>
        
        <div className="flex items-end justify-around h-full px-4 pb-8">
          {data.map((item, index) => {
            const height = ((item.demand - minValue) / range) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1 mx-1">
                <div className="relative w-full group">
                  <div
                    className="w-full bg-primary hover:bg-secondary transition-colors cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                    bg-primary text-beige text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 
                    transition-opacity whitespace-nowrap pointer-events-none">
                    {item.demand}
                  </div>
                </div>
                <span className="text-xs text-secondary mt-2 transform -rotate-45 origin-top-left">
                  {item.date || `Day ${index + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartPlaceholder;
