import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Chart as ChartJS,
    CategoryScale,
    Decimation,
    Filler,
    Legend,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './HistoricalChart.css';

ChartJS.register(
    CategoryScale,
    Decimation,
    Filler,
    Legend,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip
);

const HistoricalChart = React.memo(({ data, assetName, assetSymbol, timeRange }) => {
    const { t, i18n } = useTranslation();

    if (!data || !data.labels || data.labels.length === 0) {
        return (
            <div className="chart-container chart-loading">
                <div className="loading-skeleton"></div>
                <p>{t('chart.loading')}</p>
            </div>
        );
    }

    const formatLabel = (date) => {
        if (!(date instanceof Date)) date = new Date(date);

        if (timeRange === '1D') {
            return date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
        } else if (timeRange === '7D' || timeRange === '30D') {
            return date.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString(i18n.language, { month: 'short', year: '2-digit' });
        }
    };

    const chartData = useMemo(() => ({
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
    }), [assetSymbol, data.labels, data.prices, timeRange]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        normalized: true,
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
                text: `${assetName} - ${t(`chart.periods.${timeRange}`)}`,
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
                            label += new Intl.NumberFormat(i18n.language, {
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
            decimation: {
                enabled: data.prices.length > 120,
                algorithm: 'min-max',
                samples: 120
            }
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
                        return new Intl.NumberFormat(i18n.language, {
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
            duration: 90,
            easing: 'easeOutQuart',
        },
    }), [assetName, data.prices.length, i18n.language, t, timeRange]);

    return (
        <div className="chart-container">
            <Line data={chartData} options={options} />
        </div>
    );
});

export default HistoricalChart;
