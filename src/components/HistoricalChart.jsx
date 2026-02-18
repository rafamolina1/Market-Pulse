import React, { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './HistoricalChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const HistoricalChart = ({ data, assetName, assetSymbol, timeRange }) => {
    const chartRef = useRef(null);

    if (!data || !data.labels || data.labels.length === 0) {
        return (
            <div className="chart-container chart-loading">
                <div className="loading-skeleton"></div>
                <p>Loading chart data...</p>
            </div>
        );
    }

    const formatLabel = (date) => {
        if (!(date instanceof Date)) date = new Date(date);

        if (timeRange === '1D') {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (timeRange === '7D' || timeRange === '30D') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }
    };

    const chartData = {
        labels: data.labels.map(formatLabel),
        datasets: [
            {
                label: assetSymbol,
                data: data.prices,
                fill: true,
                borderColor: 'rgba(255, 127, 62, 1)',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(255, 127, 62, 0.3)');
                    gradient.addColorStop(0.5, 'rgba(255, 127, 62, 0.1)');
                    gradient.addColorStop(1, 'rgba(255, 127, 62, 0)');
                    return gradient;
                },
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(255, 160, 107, 1)',
                pointHoverBorderColor: '#FFFFFF',
                pointHoverBorderWidth: 2,
                tension: 0.4,
            },
        ],
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
                display: false,
            },
            title: {
                display: true,
                text: `${assetName} - ${timeRange}`,
                color: '#FFFFFF',
                font: {
                    size: 16,
                    weight: 'bold',
                    family: 'Outfit, sans-serif'
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(18, 18, 24, 0.95)',
                titleColor: '#FFB366',
                bodyColor: '#FFFFFF',
                borderColor: 'rgba(255, 127, 62, 0.5)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: context.parsed.y < 1 ? 6 : 2
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 127, 62, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#CC9977',
                    maxTicksLimit: 8,
                    font: {
                        size: 11
                    }
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 127, 62, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#CC9977',
                    callback: function (value) {
                        return new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: value < 1 ? 4 : 0,
                            notation: value > 10000 ? 'compact' : 'standard'
                        }).format(value);
                    },
                    font: {
                        size: 11
                    }
                },
            },
        },
        animation: {
            duration: 200,
            easing: 'easeOutQuart',
        },
    };

    return (
        <div className="chart-container">
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
};

export default HistoricalChart;
