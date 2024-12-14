// ResponseChart.js
"use client";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography, Box } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResponseChart = ({ data }) => {
  if (!data) return null;
  
  let countries = [];
  try {
    // Parse the stringified JSON
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    countries = parsedData.countries;
  } catch (error) {
    console.error('Error parsing data:', error);
    return null;
  }

  if (!countries || !Array.isArray(countries)) {
    console.error('No valid countries data found');
    return null;
  }

  // Format GDP to be more readable (values are already in trillions)
  const formatGDP = (gdp) => {
    return `$${gdp.toFixed(2)}T`;
  };

  // Sort countries by GDP in descending order
  const sortedCountries = [...countries].sort((a, b) => b.GDP - a.GDP);

  const chartData = {
    labels: sortedCountries.map(country => country.name),
    datasets: [
      {
        label: 'GDP (Trillion USD)',
        data: sortedCountries.map(country => country.GDP),
        backgroundColor: '#2e7d32',
        yAxisID: 'y-gdp',
      },
      {
        label: 'Number of Languages',
        data: sortedCountries.map(country => country.languages.length),
        backgroundColor: '#1976d2',
        yAxisID: 'y-languages',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const country = sortedCountries[context.dataIndex];
            if (context.dataset.label === 'Number of Languages') {
              return `Languages: ${country.languages.join(', ')}`;
            } else {
              return `GDP: ${formatGDP(country.GDP)}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      'y-gdp': {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'GDP (Trillion USD)'
        },
        ticks: {
          callback: function(value) {
            return `$${value.toFixed(1)}T`;
          }
        }
      },
      'y-languages': {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        max: 5, // Adjust based on maximum expected languages
        title: {
          display: true,
          text: 'Number of Languages'
        },
        ticks: {
          stepSize: 1
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Global Economic Overview
      </Typography>
      
      <Box sx={{ mb: 4, maxHeight: '300px', overflowY: 'auto' }}>
        {sortedCountries.map((country, index) => (
          <Box 
            key={index} 
            sx={{ 
              mb: 2, 
              pb: 2, 
              borderBottom: index < countries.length - 1 ? '1px solid #eee' : 'none',
              '&:last-child': { borderBottom: 'none', pb: 0 }
            }}
          >
            <Typography variant="h6" sx={{ color: '#1976d2' }} gutterBottom>
              {index + 1}. {country.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Capital:</strong> {country.capital}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Languages:</strong> {country.languages.join(', ')}
            </Typography>
            <Typography variant="body1" sx={{ color: '#2e7d32' }}>
              <strong>GDP:</strong> {formatGDP(country.GDP)}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ height: 400, position: 'relative' }}>
        <Bar options={options} data={chartData} />
      </Box>
    </Paper>
  );
};

export default ResponseChart;