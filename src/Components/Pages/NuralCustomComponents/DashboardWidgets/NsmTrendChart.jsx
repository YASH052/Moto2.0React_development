import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { LIGHT_GRAY, LIGHT_GRAY2, PRIMARY_BLUE2 } from '../../../Common/colors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NsmTrendChart = ({data}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Manrope',
            size: 10,
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 200,
        ticks: {
          stepSize: 50,
          font: {
            family: 'Manrope',
            size: 10,
          }
        },
        grid: {
          color: '#E0E0E0',
          drawBorder: false,
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        align: 'start',
        font: {
          family: 'Manrope',
          weight: '700',
          size: 10,
          lineHeight: '13.66px',
          letterSpacing: '0%',
          color: PRIMARY_BLUE2
        },
        color: PRIMARY_BLUE2,
        text: 'NSM-wise Trend',
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.datasetIndex === 1) {
              return 'ABSENT: ' + context.raw;
            }
            if (context.datasetIndex === 0 && context.dataIndex === 1) {
              return 'PRESENT: ' + context.raw;
            }
            return context.raw;
          }
        }
      }
    }
  };

  

  return (
    <div style={{ 
      background: LIGHT_GRAY2, 
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: '220px'
    }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default NsmTrendChart; 