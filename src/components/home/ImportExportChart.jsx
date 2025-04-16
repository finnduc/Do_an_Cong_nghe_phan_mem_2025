"use client";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ImportExportChart() {
  const getPastMonthsLabels = (count = 12) => {
       const labels = [];
       const today = new Date("2025-04-11");
       let currentMonth = today.getMonth();
       let currentYear = today.getFullYear();
       for (let i = 0; i < count; i++) {
           labels.push(`${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`);
           currentMonth--;
           if (currentMonth < 0) {
               currentMonth = 11;
               currentYear--;
           }
       }
       return labels.reverse();
  };

  const labels = getPastMonthsLabels(12);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Nhập hàng',
        data: [65, 59, 80, 81, 56, 55, 40, 90, 75, 110, 130, 150],
        backgroundColor: 'rgb(96, 165, 250)',
        hoverBackgroundColor: 'rgb(59, 130, 246)',
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: 'Xuất hàng',
        data: [28, 48, 40, 19, 86, 27, 90, 50, 65, 85, 100, 95],
        backgroundColor: 'rgb(56, 189, 248)', 
        hoverBackgroundColor: 'rgb(14, 165, 233)', 
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };



  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
           boxWidth: 10,
           padding: 25,
           usePointStyle: true,
           pointStyle: 'circle',
        }
      },
      title: {
        display: true,
        text: 'Thống Kê Nhập/Xuất Hàng (12 Tháng)',
        font: { size: 16 },
        padding: { top: 10, bottom: 20 } 
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        titleFont: { weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
      }
    },
    scales: {
      x: {
          stacked: false,
          grid: {
            display: false 
          },
          ticks: { 
              color: 'rgb(107, 114, 128)' 
          },
          border: { 
              color: 'rgba(0, 0, 0, 0.05)'
          }
      },
      y: {
        beginAtZero: true,
        stacked: false,
        grid: {
            color: 'rgba(0, 0, 0, 0.05)', 
        },
        ticks: { 
              color: 'rgb(107, 114, 128)' 
        },
        border: {
            display: false 
        }
      }
    },
    interaction: {
        mode: 'index',
        intersect: false,
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar options={options} data={data} />
    </div>
  );
}