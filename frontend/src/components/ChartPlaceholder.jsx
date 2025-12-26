const ChartPlaceholder = ({ data, title = 'Demand Prediction Chart' }) => {
  // Debug logging
  console.log('ChartPlaceholder received data:', data);
  console.log('Data type:', typeof data, 'Is array:', Array.isArray(data));
  
  if (!data) {
    console.log('Data is null or undefined');
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
        <p className="text-secondary">No data provided</p>
      </div>
    );
  }
  
  if (!Array.isArray(data)) {
    console.log('Data is not an array:', typeof data);
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
        <p className="text-secondary">Data format error: expected array</p>
        <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }
  
  if (data.length === 0) {
    console.log('Data array is empty');
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
        <p className="text-secondary">No data available to display</p>
      </div>
    );
  }

  // Ensure data is properly formatted and convert demand to numbers
  const formattedData = data.map((item, idx) => {
    // Handle both object format {date, demand} and simple number arrays
    let date, demand;
    
    if (typeof item === 'number') {
      // Simple number array
      date = `Day ${idx + 1}`;
      demand = item;
    } else if (typeof item === 'object' && item !== null) {
      // Object format
      date = item.date || item.Date || item.DateTime || `Day ${idx + 1}`;
      const demandValue = item.demand || item.Demand || item.Forecasted_Demand || 0;
      demand = typeof demandValue === 'number' ? demandValue : parseFloat(demandValue) || 0;
    } else {
      // Fallback
      date = `Day ${idx + 1}`;
      demand = 0;
    }
    
    if (idx < 3) {
      console.log(`Item ${idx}:`, item, '-> formatted:', { date, demand });
    }
    
    return { date, demand };
  }).filter(item => !isNaN(item.demand) && item.demand >= 0);
  
  console.log('Formatted data:', formattedData);
  console.log('Formatted data length:', formattedData.length);
  
  if (formattedData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
        <p className="text-secondary">Invalid data format - no valid demand values</p>
        <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  // Calculate min and max for scaling
  const values = formattedData.map(d => d.demand);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  
  console.log('Chart values - min:', minValue, 'max:', maxValue, 'range:', range);
  console.log('All values:', values);
  
  // If all values are the same, we still want to show bars (at 50% height)
  // Otherwise, calculate relative heights

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
      <div className="relative h-64 border-l-2 border-b-2 border-secondary/30 ml-12">
        {/* Y-axis labels */}
        <div className="absolute -left-12 top-0 text-xs text-secondary font-medium">
          {Math.round(maxValue)}
        </div>
        <div className="absolute -left-12 bottom-0 text-xs text-secondary font-medium">
          {Math.round(minValue)}
        </div>
        
        {/* Chart bars */}
        <div className="flex items-end justify-around h-full px-4 pb-8 gap-1" style={{ height: '100%', alignItems: 'flex-end' }}>
          {formattedData.map((item, index) => {
            // Calculate height percentage - ensure it's relative to the chart container
            let heightPercent;
            if (range === 0) {
              // All values are the same - show all bars at 60% height
              heightPercent = 60;
            } else {
              // Normalize: (value - min) / range gives 0-1, multiply by 100 for percentage
              // Add 10% minimum so even the smallest bar is visible
              const normalized = (item.demand - minValue) / range;
              heightPercent = 10 + (normalized * 90); // Scale from 10% to 100%
            }
            
            const displayDate = item.date && item.date.length > 10 ? item.date.substring(0, 10) : item.date;
            
            // Calculate actual pixel height based on container (h-64 = 256px minus padding)
            const containerHeight = 200; // Approximate available height after padding
            const actualHeight = Math.max((heightPercent / 100) * containerHeight, 12);
            
            console.log(`Bar ${index}: demand=${item.demand}, normalized=${range > 0 ? ((item.demand - minValue) / range).toFixed(2) : 'N/A'}, heightPercent=${heightPercent.toFixed(1)}%, actualHeight=${actualHeight.toFixed(1)}px`);
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 min-w-0 max-w-full" style={{ height: '100%' }}>
                <div 
                  className="relative w-full group" 
                  style={{ 
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}
                >
                  <div
                    className="bg-primary hover:bg-secondary transition-all cursor-pointer rounded-t shadow-sm"
                    style={{ 
                      height: `${actualHeight}px`,
                      minHeight: '12px',
                      width: '100%',
                      maxWidth: '100%',
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                      display: 'block'
                    }}
                    title={`${displayDate}: ${Math.round(item.demand)} units`}
                  />
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-10
                    bg-primary text-beige text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 
                    transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                    {Math.round(item.demand)} units
                  </div>
                </div>
                <span 
                  className="text-xs text-secondary mt-2 truncate w-full text-center block" 
                  title={displayDate}
                  style={{ fontSize: '10px' }}
                >
                  {displayDate || `Day ${index + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500">
          <p>Data points: {formattedData.length} | Range: {Math.round(minValue)} - {Math.round(maxValue)}</p>
        </div>
      )}
    </div>
  );
};

export default ChartPlaceholder;
