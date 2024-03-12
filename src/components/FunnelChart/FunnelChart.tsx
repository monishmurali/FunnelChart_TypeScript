import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Papa from "papaparse";
import "chart.js/auto";
import {
  Chart as ChartJS,
  ChartOptions,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

interface DataRow {
  Age: string;
  Male: string;
  Female: string;
}

interface ChartData {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      backgroundColor: string;
    },
    {
      label: string;
      data: number[];
      backgroundColor: string;
    }
  ];
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FunnelChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Male",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Female",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  });

  useEffect(() => {
    const fetchCSVData = async () => {
      const response = await fetch("data.csv");
      const text = await response.text();

      Papa.parse<DataRow>(text, {
        header: true,
        complete: (results) => {
          const parsedData = results.data;
          setChartData({
            labels: parsedData.map((row) => row.Age),
            datasets: [
              {
                label: "Male",
                data: parsedData.map((row) => -Math.abs(parseFloat(row.Male))),
                backgroundColor: "rgba(54, 22, 135, 0.6)",
              },
              {
                label: "Female",
                data: parsedData.map((row) => Math.abs(parseFloat(row.Female))),
                backgroundColor: "rgba(255, 99, 32, 0.6)",
              },
            ],
          });
        },
      });
    };

    fetchCSVData();
  }, []);

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function (val: string | number) {
            return Math.abs(Number(val));
          },
          stepSize: 0.5,
        },
        grid: {
          drawOnChartArea: true,
        },
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage of Population (%)",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Age Group",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Population Distribution by Age Group",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default FunnelChart;
