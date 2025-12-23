const API_BASE_URL = 'http://localhost:3000/api';

export const predictByCategory = async (formData) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          category: formData.get('categoryName'),
          predictions: [
            { date: '2025-12-21', demand: 125 },
            { date: '2025-12-22', demand: 138 },
            { date: '2025-12-23', demand: 145 },
            { date: '2025-12-24', demand: 152 },
            { date: '2025-12-25', demand: 160 },
            { date: '2025-12-26', demand: 168 },
            { date: '2025-12-27', demand: 175 },
          ],
          insights: [
            'Demand is showing an upward trend of 8.5% over the selected period.',
            'Peak demand expected on weekends.',
            'Consider increasing inventory by 15% for the next week.',
          ],
          summary: {
            averageDemand: 152,
            trendDirection: 'increasing',
            confidence: 0.87,
          },
        });
      }, 1500);
    });
  } catch (error) {
    console.error('Error in predictByCategory:', error);
    throw new Error('Failed to fetch category prediction. Please try again.');
  }
};

export const predictDirect = async (demandValues) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const avg = demandValues.reduce((a, b) => a + b, 0) / demandValues.length;
        const trend = demandValues[6] - demandValues[0];
        const nextDayPrediction = Math.round(avg + trend * 0.3);

        resolve({
          success: true,
          inputValues: demandValues,
          prediction: {
            nextDay: nextDayPrediction,
            next7Days: Array.from({ length: 7 }, (_, i) => 
              Math.round(nextDayPrediction + i * (trend / 7))
            ),
          },
          insights: [
            `Based on historical data, predicted demand for tomorrow: ${nextDayPrediction} units.`,
            trend > 0 
              ? 'Demand trend is increasing. Plan for higher inventory.' 
              : 'Demand trend is stable or decreasing.',
            `Average demand over the past week: ${Math.round(avg)} units.`,
          ],
          confidence: 0.82,
        });
      }, 1200);
    });
  } catch (error) {
    console.error('Error in predictDirect:', error);
    throw new Error('Failed to generate prediction. Please try again.');
  }
};

export const analyzeAllCategories = async (formData) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          totalCategories: 5,
          dateRange: formData.get('dateRange'),
          categories: [
            {
              name: 'Electronics',
              totalDemand: 1250,
              averageDemand: 178,
              trend: 'increasing',
              predictions: [
                { date: '2025-12-21', demand: 185 },
                { date: '2025-12-22', demand: 192 },
                { date: '2025-12-23', demand: 198 },
                { date: '2025-12-24', demand: 205 },
                { date: '2025-12-25', demand: 212 },
              ],
            },
            {
              name: 'Clothing',
              totalDemand: 980,
              averageDemand: 140,
              trend: 'stable',
              predictions: [
                { date: '2025-12-21', demand: 138 },
                { date: '2025-12-22', demand: 142 },
                { date: '2025-12-23', demand: 140 },
                { date: '2025-12-24', demand: 145 },
                { date: '2025-12-25', demand: 143 },
              ],
            },
            {
              name: 'Food & Beverages',
              totalDemand: 2100,
              averageDemand: 300,
              trend: 'increasing',
              predictions: [
                { date: '2025-12-21', demand: 310 },
                { date: '2025-12-22', demand: 318 },
                { date: '2025-12-23', demand: 325 },
                { date: '2025-12-24', demand: 335 },
                { date: '2025-12-25', demand: 342 },
              ],
            },
            {
              name: 'Home & Garden',
              totalDemand: 650,
              averageDemand: 93,
              trend: 'decreasing',
              predictions: [
                { date: '2025-12-21', demand: 90 },
                { date: '2025-12-22', demand: 88 },
                { date: '2025-12-23', demand: 85 },
                { date: '2025-12-24', demand: 83 },
                { date: '2025-12-25', demand: 80 },
              ],
            },
            {
              name: 'Sports & Outdoors',
              totalDemand: 820,
              averageDemand: 117,
              trend: 'stable',
              predictions: [
                { date: '2025-12-21', demand: 115 },
                { date: '2025-12-22', demand: 118 },
                { date: '2025-12-23', demand: 116 },
                { date: '2025-12-24', demand: 119 },
                { date: '2025-12-25', demand: 117 },
              ],
            },
          ],
          overallInsights: [
            'Food & Beverages shows the highest demand across all categories.',
            '3 out of 5 categories show increasing or stable trends.',
            'Home & Garden category experiencing declining demand - consider promotional strategies.',
            'Overall demand expected to increase by 5.2% in the next week.',
          ],
        });
      }, 2000);
    });
  } catch (error) {
    console.error('Error in analyzeAllCategories:', error);
    throw new Error('Failed to analyze categories. Please try again.');
  }
};
