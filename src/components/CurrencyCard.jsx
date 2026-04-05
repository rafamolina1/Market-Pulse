import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../utils/formatters';

const CurrencyCard = React.memo(({ pair, rate, change, flag, onChartClick }) => {
    const { t, i18n } = useTranslation();
    const isPositive = change >= 0;

    return (
        <div className="glass-card currency-card">
            <div className="card-header">
                <div className="card-header-main">
                    <div className="card-title">{t('cards.currency.title')}</div>
                    <div className="card-pair">{pair}</div>
                </div>
                <div className="card-header-actions">
                    <div className="card-icon" style={{ color: 'var(--color-cyan)' }}>
                        {flag || '💱'}
                    </div>
                    {onChartClick && (
                        <button
                            className="chart-button"
                            onClick={onChartClick}
                            title={t('chart.openAsset', { asset: pair })}
                            aria-label={t('chart.openAsset', { asset: pair })}
                        >
                            📈
                        </button>
                    )}
                </div>
            </div>

            <div className="card-price">
                {formatNumber(rate, 4, i18n.language)}
            </div>

            <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
                <span className="change-arrow">{isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(change).toFixed(2)}%</span>
            </div>

            <div className="card-meta">
                <div>
                    <span className="meta-label">{t('cards.currency.metaPrimaryLabel')}</span>
                    <span className="meta-value">
                        {isPositive ? t('cards.currency.metaPrimaryPositive') : t('cards.currency.metaPrimaryNegative')}
                    </span>
                </div>
                <div>
                    <span className="meta-label">{t('cards.currency.metaSecondaryLabel')}</span>
                    <span className="meta-value">
                        {isPositive ? t('cards.currency.metaSecondaryPositive') : t('cards.currency.metaSecondaryNegative')}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default CurrencyCard;
