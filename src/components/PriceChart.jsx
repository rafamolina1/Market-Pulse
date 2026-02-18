import React, { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
);

const PriceChart = ({ data, color = '#06b6d4', label = 'Price' }) => {
    const chartRef = useRef(null);

    const chartData = {
        labels: data.map((_, index) => index),
        datasets: [
            {
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: `${color}33`,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#f9fafb',
                bodyColor: '#d1d5db',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `${label}: $${context.parsed.y.toFixed(2)}`;
                    }
                }
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        animation: {
            duration: 750,
            easing: 'easeInOutQuart',
        },
    };

    useEffect(() => {
        const chart = chartRef.current;
        if (chart) {
            chart.update('active');
        }
    }, [data]);

    return (
        <div className="chart-container">
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
};

export default PriceChart;
