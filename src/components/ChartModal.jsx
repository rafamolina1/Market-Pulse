import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TimeRangeSelector from './TimeRangeSelector';
import HistoricalChart from './HistoricalChart';
import {
    fetchCryptoHistory,
    fetchCurrencyHistory,
    fetchCommodityHistory
} from '../services/historicalDataService';
import './ChartModal.css';

const ChartModal = ({ isOpen, onClose, asset, assetType }) => {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState('30D');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    const assetInfo = useMemo(() => {
        if (!asset) return { name: '', symbol: '' };

        if (assetType === 'crypto') return { name: asset.name, symbol: asset.symbol };
        if (assetType === 'currency') return { name: asset.pair, symbol: asset.pair };
        if (assetType === 'commodity') return { name: asset.name, symbol: asset.symbol };

        return { name: '', symbol: '' };
    }, [asset, assetType]);

    const loadChartData = useCallback(async () => {
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
    }, [asset, assetType, timeRange]);

    useEffect(() => {
        if (isOpen && asset) {
            loadChartData();
        }
    }, [isOpen, asset, timeRange, loadChartData]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    const { name, symbol } = assetInfo;

    return (
        <div className="chart-modal-overlay" onClick={onClose}>
            <div
                className="chart-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="chart-modal-title"
            >
                <div className="chart-modal-header">
                    <div>
                        <h2 id="chart-modal-title" className="chart-modal-title">{name}</h2>
                        <p className="chart-modal-subtitle">{t('chart.subtitle')}</p>
                    </div>
                    <button className="chart-modal-close" onClick={onClose} aria-label={t('buttons.close')}>
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
                            <p>{t('chart.loadingRange', { range: t(`chart.periods.${timeRange}`) })}</p>
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
