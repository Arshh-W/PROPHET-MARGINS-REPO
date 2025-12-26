// Simple test component to verify chart works
import ChartPlaceholder from './ChartPlaceholder';

const ChartTest = () => {
  const testData1 = [
    { date: '2024-12-01', demand: 100 },
    { date: '2024-12-02', demand: 120 },
    { date: '2024-12-03', demand: 110 },
    { date: '2024-12-04', demand: 130 },
    { date: '2024-12-05', demand: 125 },
  ];

  const testData2 = [63, 70, 79, 87, 61, 68, 75];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Chart Test Component</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Test 1: Object Array</h3>
        <ChartPlaceholder data={testData1} title="Test Chart 1" />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Test 2: Number Array</h3>
        <ChartPlaceholder data={testData2} title="Test Chart 2" />
      </div>
    </div>
  );
};

export default ChartTest;

