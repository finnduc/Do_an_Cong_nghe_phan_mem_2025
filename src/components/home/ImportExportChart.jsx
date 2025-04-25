"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Chart  } from "../../lib/api/home";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ImportExportChart() {
  const [chart, setChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Nhập hàng",
        data: [],
        backgroundColor: "rgb(96, 165, 250)",
        hoverBackgroundColor: "rgb(59, 130, 246)",
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: "Xuất hàng",
        data: [],
        backgroundColor: "rgb(56, 189, 248)",
        hoverBackgroundColor: "rgb(14, 165, 233)",
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  });


  useEffect(() => {
    const fetch_data = async () => {
      try {
        const response = await Chart();
        const data = response.metadata;
        const month_fake = data.map((item) => item.month);
        const month_real = [...month_fake].reverse();
        const import_data_fake = data.map((item) => item.import_quantity);
        const import_data_real = [...import_data_fake].reverse();
        const export_data_fake = data.map((item) => item.export_quantity);
        const export_data_real = [...export_data_fake].reverse();
        setChart({
          labels: month_real,
          datasets: [
            {
              label: "Nhập hàng",
              data: import_data_real,
              backgroundColor: "rgb(96, 165, 250)",
              hoverBackgroundColor: "rgb(59, 130, 246)",
              borderRadius: 4,
              barPercentage: 0.6,
            },
            {
              label: "Xuất hàng",
              data: export_data_real,
              backgroundColor: "rgb(56, 189, 248)",
              hoverBackgroundColor: "rgb(14, 165, 233)",
              borderRadius: 4,
              barPercentage: 0.6,
            },
          ],
        });
      } catch (error) {
        console.error("API call failed:", error);
        setChart({
          labels: [],
          datasets: [
            {
              label: "Nhập hàng",
              data: [],
              backgroundColor: "rgb(96, 165, 250)",
              hoverBackgroundColor: "rgb(59, 130, 246)",
              borderRadius: 4,
              barPercentage: 0.6,
            },
            {
              label: "Xuất hàng",
              data: [],
              backgroundColor: "rgb(56, 189, 248)",
              hoverBackgroundColor: "rgb(14, 165, 233)",
              borderRadius: 4,
              barPercentage: 0.6,
            },
          ],
        });
      }
    };
    fetch_data();
  }, []);

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
    <div style={{ height: "400px", width: "100%" }}>
      <Bar options={options} data={chart} />
    </div>
  );
}
