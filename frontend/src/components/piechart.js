import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
  } from 'chart.js';
  
  // Register components
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
  );
  

const PieChart = ({ beeIn, beeOut }) => {
    const data = {
        labels: ['Bee In', 'Bee Out'],
        datasets: [
            {
                data: [beeIn, beeOut],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    return <Pie data={data} />;
};

export default PieChart;