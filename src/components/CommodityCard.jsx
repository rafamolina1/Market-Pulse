import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const CommodityCard = React.memo(({ name, symbol, price, unit, change, icon, onChartClick }) => {
    const { t, i18n } = useTranslation();
    const isPositive = change >= 0;

    return (
        <div className="glass-card commodity-card">
            <div className="card-header">
                <div className="card-header-main">
                    <div className="card-title">{name}</div>
                    <div className="card-pair">{symbol}</div>
                </div>
                <div className="card-header-actions">
                    <div className="card-icon" style={{ fontSize: '2rem' }}>
                        {icon || '📊'}
                    </div>
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
                {formatCurrency(price, 'USD', 2, i18n.language)}
            </div>

            <div className="card-price-subtext">
                {t('cards.commodity.unitPrefix')} {unit}
            </div>

            <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
                <span className="change-arrow">{isPositive ? '↑' : '↓'}</span>
                <span>{formatPercentage(Math.abs(change))}</span>
            </div>

            <div className="card-meta">
                <div>
                    <span className="meta-label">{t('cards.commodity.metaPrimaryLabel')}</span>
                    <span className="meta-value" style={{ color: isPositive ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                        {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </span>
                </div>
                <div>
                    <span className="meta-label">{t('cards.commodity.metaSecondaryLabel')}</span>
                    <span className="meta-value">
                        {isPositive ? t('cards.commodity.metaSecondaryPositive') : t('cards.commodity.metaSecondaryNegative')}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default CommodityCard;
