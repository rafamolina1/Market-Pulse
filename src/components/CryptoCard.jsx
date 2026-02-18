import React from 'react';
import { formatCurrency, formatPercentage, formatCompactNumber } from '../utils/formatters';

const CryptoCard = React.memo(({ name, symbol, image, current_price, price_change_percentage_24h, market_cap, onChartClick }) => {
    const isPositive = price_change_percentage_24h >= 0;

    return (
        <div className="glass-card crypto-card">
            <div className="card-header">
                <div>
                    <div className="card-title">{name}</div>
                    <div className="card-pair">{symbol}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                        src={image}
                        alt={name}
                        className="card-icon"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%'
                        }}
                    />
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
                {formatCurrency(current_price, 'USD', current_price < 1 ? 4 : 2)}
            </div>

            <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
                <span className="change-arrow">{isPositive ? '↑' : '↓'}</span>
                <span>{formatPercentage(Math.abs(price_change_percentage_24h))}</span>
            </div>

            <div className="card-meta">
                <div>
                    <div className="meta-label">Market Cap</div>
                    <div className="meta-value">{formatCompactNumber(market_cap)}</div>
                </div>
            </div>
        </div>
    );
});

export default CryptoCard;
