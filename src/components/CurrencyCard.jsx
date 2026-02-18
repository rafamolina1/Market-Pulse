import React from 'react';
import { formatNumber } from '../utils/formatters';

const CurrencyCard = React.memo(({ pair, rate, change, flag, onChartClick }) => {
    const isPositive = change >= 0;

    return (
        <div className="glass-card currency-card">
            <div className="card-header">
                <div>
                    <div className="card-title">Currency</div>
                    <div className="card-pair">{pair}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="card-icon" style={{ color: 'var(--color-cyan)' }}>
                        {flag || '💱'}
                    </div>
                    {onChartClick && (
                        <button
                            className="chart-button"
                            onClick={onChartClick}
                            title="View chart"
                        >
                            📈
                        </button>
                    )}
                </div>
            </div>

            <div className="card-price">
                {formatNumber(rate, 4)}
            </div>

            <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
                <span className="change-arrow">{isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(change).toFixed(2)}%</span>
            </div>

            <div className="card-meta">
                <span className="meta-label">24h Volume</span>
                <span className="meta-value">High Activity</span>
            </div>
        </div>
    );
});

export default CurrencyCard;
