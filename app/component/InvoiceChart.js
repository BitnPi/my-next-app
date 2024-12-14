import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function InvoiceChart({ data }) {
  if (!data || !data.items) return null;

  const chartData = {
    labels: data.items.map(item => item.description),
    datasets: [
      {
        label: 'Amount',
        data: data.items.map(item => item.amount),
        backgroundColor: '#2e7d32',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Invoice Items Breakdown'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)'
        },
        ticks: {
          callback: value => `$${value.toFixed(2)}`
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Financial Breakdown
      </Typography>
      
      <Box sx={{ height: 400, position: 'relative' }}>
        <Bar options={options} data={chartData} />
      </Box>
    </Paper>
  );
}