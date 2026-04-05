import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatPercentage, formatCompactNumber } from '../utils/formatters';

const CryptoCard = React.memo(({ name, symbol, image, current_price, price_change_percentage_24h, market_cap, onChartClick }) => {
    const { t, i18n } = useTranslation();
    const isPositive = price_change_percentage_24h >= 0;

    return (
        <div className="glass-card crypto-card">
            <div className="card-header">
                <div className="card-header-main">
                    <div className="card-title">{name}</div>
                    <div className="card-pair">{symbol}</div>
                </div>
                <div className="card-header-actions">
                    <img
                        src={image}
                        alt={name}
                        className="card-icon"
                        loading="lazy"
                        decoding="async"
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
                            title={t('chart.openAsset', { asset: name })}
                            aria-label={t('chart.openAsset', { asset: name })}
                        >
                            📈
                        </button>
                    )}
                </div>
            </div>

            <div className="card-price">
                {formatCurrency(current_price, 'USD', current_price < 1 ? 4 : 2, i18n.language)}
            </div>

            <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
                <span className="change-arrow">{isPositive ? '↑' : '↓'}</span>
                <span>{formatPercentage(Math.abs(price_change_percentage_24h))}</span>
            </div>

            <div className="card-meta">
                <div>
                    <span className="meta-label">{t('cards.crypto.metaPrimaryLabel')}</span>
                    <span className="meta-value">{formatCompactNumber(market_cap)}</span>
                </div>
                <div>
                    <span className="meta-label">{t('cards.crypto.metaSecondaryLabel')}</span>
                    <span className="meta-value">
                        {isPositive ? t('cards.crypto.metaSecondaryPositive') : t('cards.crypto.metaSecondaryNegative')}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default CryptoCard;
