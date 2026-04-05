import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Chart as ChartJS,
    CategoryScale,
    Decimation,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    Decimation,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip
);

const PriceChart = React.memo(({ data, color = '#06b6d4', label = 'Price' }) => {
    const { i18n } = useTranslation();

    const chartData = useMemo(() => ({
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
    }), [color, data, label]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        normalized: true,
        plugins: {
            legend: {
                display: false,
            },
            decimation: {
                enabled: data.length > 80,
                algorithm: 'min-max',
                samples: 80
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
                        const formatted = new Intl.NumberFormat(i18n.language, {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(context.parsed.y);

                        return `${label}: ${formatted}`;
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
            duration: 180,
            easing: 'easeOutQuart',
        },
    }), [data.length, i18n.language, label]);

    return (
        <div className="chart-container">
            <Line data={chartData} options={options} />
        </div>
    );
});

export default PriceChart;
