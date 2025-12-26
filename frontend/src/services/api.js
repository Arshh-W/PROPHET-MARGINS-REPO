const API_BASE_URL = 'http://localhost:5000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Option 1: Predict by category (single category from dataset)
export const predictByCategory = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    const data = await handleResponse(response);
    
    // Transform backend response to frontend format
    if (data.error) {
      throw new Error(data.error);
    }

    // Backend returns: { type, results, inference }
    console.log('Backend response for Mode 1:', data);
    console.log('Results array:', data.results);
    
    // Transform to match frontend expectations
    const predictions = data.results.map((item, idx) => {
      const demandValue = item.Demand || item.Forecasted_Demand || item.demand || 0;
      const result = {
        date: item.Date || item.DateTime || item.date || '',
        demand: typeof demandValue === 'number' ? demandValue : parseFloat(demandValue) || 0,
      };
      if (idx < 3) {
        console.log(`Prediction ${idx}:`, item, '->', result);
      }
      return result;
    }).filter(item => item.demand > 0); // Filter out invalid data
    
    console.log('Final predictions array:', predictions);

    return {
      success: true,
      category: formData.get('categoryName'),
      predictions,
      insights: data.inference ? [data.inference] : [],
      summary: {
        averageDemand: predictions.length > 0 
          ? Math.round(predictions.reduce((sum, p) => sum + p.demand, 0) / predictions.length)
          : 0,
        trendDirection: predictions.length > 1 && predictions[predictions.length - 1].demand > predictions[0].demand
          ? 'increasing'
          : 'stable',
        confidence: 0.85,
      },
    };
  } catch (error) {
    console.error('Error in predictByCategory:', error);
    throw new Error(error.message || 'Failed to fetch category prediction. Please try again.');
  }
};

// Option 2: Direct prediction from manual input
export const predictDirect = async (demandValues, startDate) => {
  try {
    const requestBody = {
      option: 2,
      data: {
        start_date: startDate || new Date().toISOString().split('T')[0],
        sales_data: demandValues,
      },
    };

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await handleResponse(response);

    if (data.error) {
      throw new Error(data.error);
    }

    // Backend returns: { type, results, inference }
    console.log('Backend response for Mode 2:', data);
    console.log('Results array:', data.results);
    
    const predictions = data.results.map((item, idx) => {
      const demandValue = item.Demand || item.demand || 0;
      const result = {
        date: item.Date || item.date || '',
        demand: typeof demandValue === 'number' ? demandValue : parseFloat(demandValue) || 0,
      };
      if (idx < 3) {
        console.log(`Prediction ${idx}:`, item, '->', result);
      }
      return result;
    }).filter(item => item.demand > 0); // Filter out invalid data
    
    console.log('Final predictions for Mode 2:', predictions);

    const nextDayPrediction = predictions[0]?.demand || 0;
    const avg = demandValues.reduce((a, b) => a + b, 0) / demandValues.length;
    const trend = demandValues[demandValues.length - 1] - demandValues[0];

    // Ensure next7Days is an array of numbers
    const next7DaysArray = predictions.map(p => {
      const demand = typeof p.demand === 'number' ? p.demand : parseFloat(p.demand) || 0;
      return Math.round(demand); // Round to integer
    });
    
    console.log('next7Days array:', next7DaysArray);
    console.log('Array length:', next7DaysArray.length);
    console.log('Min value:', Math.min(...next7DaysArray));
    console.log('Max value:', Math.max(...next7DaysArray));
    
    return {
      success: true,
      inputValues: demandValues,
      prediction: {
        nextDay: nextDayPrediction,
        next7Days: next7DaysArray,
      },
      insights: data.inference 
        ? [data.inference]
        : [
            `Based on historical data, predicted demand for tomorrow: ${nextDayPrediction} units.`,
            trend > 0 
              ? 'Demand trend is increasing. Plan for higher inventory.' 
              : 'Demand trend is stable or decreasing.',
            `Average demand over the past week: ${Math.round(avg)} units.`,
          ],
      confidence: 0.82,
    };
  } catch (error) {
    console.error('Error in predictDirect:', error);
    throw new Error(error.message || 'Failed to generate prediction. Please try again.');
  }
};

// Option 3: Analyze all categories
export const analyzeAllCategories = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    const data = await handleResponse(response);

    if (data.error) {
      throw new Error(data.error);
    }

    // Backend returns DataFrame with DateTime, ProductCategory, Forecasted_Demand
    const results = data.results || [];
    
    // Group by category
    const categoryMap = {};
    results.forEach(item => {
      const cat = item.ProductCategory || item.category;
      if (!categoryMap[cat]) {
        categoryMap[cat] = [];
      }
      categoryMap[cat].push({
        date: item.DateTime || item.Date || item.date,
        demand: item.Forecasted_Demand || item.Demand || item.demand,
      });
    });

    // Transform to frontend format
    const categories = Object.entries(categoryMap).map(([name, predictions]) => {
      // Ensure all predictions have valid demand values
      const validPredictions = predictions.map(p => ({
        date: p.date || '',
        demand: typeof p.demand === 'number' ? p.demand : parseFloat(p.demand) || 0,
      })).filter(p => p.demand > 0);
      
      if (validPredictions.length === 0) return null;
      
      const totalDemand = validPredictions.reduce((sum, p) => sum + p.demand, 0);
      const avgDemand = Math.round(totalDemand / validPredictions.length);
      const trend = validPredictions.length > 1 && validPredictions[validPredictions.length - 1].demand > validPredictions[0].demand
        ? 'increasing'
        : validPredictions.length > 1 && validPredictions[validPredictions.length - 1].demand < validPredictions[0].demand
        ? 'decreasing'
        : 'stable';

      return {
        name,
        totalDemand,
        averageDemand: avgDemand,
        trend,
        predictions: validPredictions.slice(0, 30), // Show first 30 days for better visualization
      };
    }).filter(cat => cat !== null); // Remove null entries

    return {
      success: true,
      totalCategories: categories.length,
      dateRange: formData.get('dateRange') || '30',
      categories,
      overallInsights: data.inference 
        ? [data.inference]
        : [
            `${categories.length} categories analyzed successfully.`,
            categories.filter(c => c.trend === 'increasing').length > 0
              ? `${categories.filter(c => c.trend === 'increasing').length} categories showing increasing demand.`
              : 'Most categories showing stable demand.',
          ],
    };
  } catch (error) {
    console.error('Error in analyzeAllCategories:', error);
    throw new Error(error.message || 'Failed to analyze categories. Please try again.');
  }
};


