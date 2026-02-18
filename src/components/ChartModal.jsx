import React, { useState, useEffect } from 'react';
import TimeRangeSelector from './TimeRangeSelector';
import HistoricalChart from './HistoricalChart';
import {
    fetchCryptoHistory,
    fetchCurrencyHistory,
    fetchCommodityHistory
} from '../services/historicalDataService';
import './ChartModal.css';

const ChartModal = ({ isOpen, onClose, asset, assetType }) => {
    const [timeRange, setTimeRange] = useState('30D');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && asset) {
            loadChartData();
        }
    }, [isOpen, asset, timeRange]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const loadChartData = async () => {
        if (!asset) return;

        setLoading(true);
        try {
            let data;
            if (assetType === 'crypto') {
                data = await fetchCryptoHistory(asset.id, timeRange);
            } else if (assetType === 'currency') {
                data = await fetchCurrencyHistory(asset.pair, timeRange);
            } else if (assetType === 'commodity') {
                data = await fetchCommodityHistory(asset.symbol, timeRange);
            }
            setChartData(data);
        } catch (error) {
            console.error('Error loading chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getAssetInfo = () => {
        if (assetType === 'crypto') {
            return { name: asset.name, symbol: asset.symbol };
        } else if (assetType === 'currency') {
            return { name: asset.pair, symbol: asset.pair };
        } else if (assetType === 'commodity') {
            return { name: asset.name, symbol: asset.symbol };
        }
        return { name: '', symbol: '' };
    };

    const { name, symbol } = getAssetInfo();

    return (
        <div className="chart-modal-overlay" onClick={onClose}>
            <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="chart-modal-header">
                    <div>
                        <h2 className="chart-modal-title">{name}</h2>
                        <p className="chart-modal-subtitle">Historical Price Chart</p>
                    </div>
                    <button className="chart-modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <TimeRangeSelector
                    selectedRange={timeRange}
                    onRangeChange={setTimeRange}
                />

                <div className="chart-modal-content">
                    {loading ? (
                        <div className="chart-loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading {timeRange} data...</p>
                        </div>
                    ) : (
                        <HistoricalChart
                            data={chartData}
                            assetName={name}
                            assetSymbol={symbol}
                            timeRange={timeRange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChartModal;
