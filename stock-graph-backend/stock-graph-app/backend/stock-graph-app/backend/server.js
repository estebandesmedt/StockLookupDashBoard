// backend/server.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

// Your API key for Alpha Vantage (replace with your actual key)
const API_KEY = 'P5P5E9YD6D8DVIOB';  // Get it from https://www.alphavantage.co/support/#api-key

// Endpoint to fetch stock data
app.get('/api/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const fromDate = lastMonth.toISOString().split('T')[0]; // Format YYYY-MM-DD

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: API_KEY,
        outputsize: 'compact',
      },
    });

    // Filter out the data for the past month
    const data = response.data['Time Series (Daily)'];
    const filteredData = Object.entries(data).filter(([date]) => date >= fromDate);

    const graphData = filteredData.map(([date, values]) => ({
      date,
      close: parseFloat(values['4. close']),
    }));

    res.json(graphData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching stock data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
