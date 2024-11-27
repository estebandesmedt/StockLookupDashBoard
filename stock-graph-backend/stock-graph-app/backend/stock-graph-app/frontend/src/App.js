// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css'; // Import the CSS file for styling

// Register necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [symbol, setSymbol] = useState('');
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${symbol}`);
      const data = response.data;

      const labels = data.map((item) => item.date);
      const closePrices = data.map((item) => item.close);

      setChartData({
        labels,
        datasets: [
          {
            label: `Stock Price of ${symbol.toUpperCase()}`,
            data: closePrices,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
          },
        ],
      });
      setError('');
    } catch (error) {
      setError('Error fetching stock data');
      setChartData(null);
    }
  };

  return (
    <div className="App">
      <h1>Stock Price Graph</h1>
      <input
        type="text"
        value={symbol}
        onChange={handleSymbolChange}
        placeholder="Enter stock ticker (e.g., NVDA)"
      />
      <button onClick={fetchStockData}>Fetch Data</button>

      {error && <p>{error}</p>}

      {chartData ? (
        <div className="LineChart">
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: `Stock Price for ${symbol.toUpperCase()}`,
                },
              },
            }}
          />
        </div>
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default App;
