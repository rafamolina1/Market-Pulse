import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const CommodityCard = React.memo(({ name, symbol, price, unit, change, icon, onChartClick }) => {
    const isPositive = change >= 0;

    return (
        <div className="glass-card commodity-card">
            <div className="card-header">
                <div>
                    <div className="card-title">{name}</div>
                    <div className="card-pair">{symbol}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="card-icon" style={{ fontSize: '2rem' }}>
                        {icon || '📊'}
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
                {formatCurrency(price, 'USD', 2)}
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                per {unit}
            </div>

            <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
                <span className="change-arrow">{isPositive ? '↑' : '↓'}</span>
                <span>{formatPercentage(Math.abs(change))}</span>
            </div>

            <div className="card-meta">
                <span className="meta-label">24h Change</span>
                <span className="meta-value" style={{ color: isPositive ? 'var(--color-green)' : 'var(--color-red)' }}>
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                </span>
            </div>
        </div>
    );
});

export default CommodityCard;
