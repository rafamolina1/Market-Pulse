import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMarket } from '../contexts/MarketContext';
import { AVAILABLE_CURRENCIES } from '../services/currencyService';
import { formatNumber } from '../utils/formatters';
import './CurrencyConverter.css';

const CurrencyConverter = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const { currencies: currentRates } = useMarket();
    const [fromCurrency, setFromCurrency] = useState('usd');
    const [toCurrency, setToCurrency] = useState('eur');
    const [amount, setAmount] = useState(100);
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0);

    const allCurrencies = useMemo(() => [
        { target: 'usd', name: 'US Dollar', pair: 'USD', flag: '🇺🇸' },
        ...AVAILABLE_CURRENCIES.map(c => ({
            ...c,
            pair: c.target.toUpperCase()
        }))
    ], []);

    useEffect(() => {
        if (isOpen && currentRates) {
            calculateConversion();
        }
    }, [amount, fromCurrency, toCurrency, currentRates, isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const calculateConversion = () => {
        if (!currentRates || currentRates.length === 0 || Number.isNaN(amount)) {
            setConvertedAmount(0);
            setExchangeRate(0);
            return;
        }

        let rate = 1;

        if (fromCurrency === 'usd' && toCurrency !== 'usd') {
            const targetRate = currentRates.find(r => r.target === toCurrency);
            rate = targetRate ? targetRate.rate : 1;
        }
        else if (fromCurrency !== 'usd' && toCurrency === 'usd') {
            const sourceRate = currentRates.find(r => r.target === fromCurrency);
            rate = sourceRate ? 1 / sourceRate.rate : 1;
        }
        else if (fromCurrency !== 'usd' && toCurrency !== 'usd') {
            const fromRate = currentRates.find(r => r.target === fromCurrency);
            const toRate = currentRates.find(r => r.target === toCurrency);
            if (fromRate && toRate) {
                rate = toRate.rate / fromRate.rate;
            }
        }
        else {
            rate = 1;
        }

        setExchangeRate(rate);
        setConvertedAmount(amount * rate);
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            setAmount(value === '' ? 0 : parseFloat(value));
        }
    };

    const getCurrencyInfo = (currencyCode) => {
        return allCurrencies.find(c => c.target === currencyCode);
    };

    if (!isOpen) return null;

    return (
        <div className="converter-overlay" onClick={onClose}>
            <div
                className="converter-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="converter-title"
            >
                <div className="converter-header">
                    <div>
                        <h2 id="converter-title" className="converter-title">💱 {t('converter.title')}</h2>
                        <p className="converter-subtitle">{t('converter.description')}</p>
                    </div>
                    <button className="converter-close" onClick={onClose} aria-label={t('buttons.close')}>✕</button>
                </div>

                <div className="converter-body">
                    <div className="converter-section">
                        <label className="converter-label">{t('converter.amount')}</label>
                        <input
                            type="number"
                            className="converter-input"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder={t('converter.enterAmount')}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="converter-section">
                        <label className="converter-label">{t('converter.from')}</label>
                        <select
                            className="converter-select"
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                        >
                            {allCurrencies.map(currency => (
                                <option key={currency.target} value={currency.target}>
                                    {currency.flag} {currency.pair} - {currency.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="converter-swap-container">
                        <button
                            className="converter-swap-btn"
                            onClick={handleSwap}
                            aria-label={t('converter.swap')}
                            title={t('converter.swap')}
                        >
                            🔄
                        </button>
                    </div>

                    <div className="converter-section">
                        <label className="converter-label">{t('converter.to')}</label>
                        <select
                            className="converter-select"
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                        >
                            {allCurrencies.map(currency => (
                                <option key={currency.target} value={currency.target}>
                                    {currency.flag} {currency.pair} - {currency.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {exchangeRate > 0 && (
                        <div className="converter-rate">
                            <span className="rate-label">{t('converter.rate')}</span>
                            <span className="rate-value">
                                1 {getCurrencyInfo(fromCurrency)?.pair} = {formatNumber(exchangeRate, 6, i18n.language)} {getCurrencyInfo(toCurrency)?.pair}
                            </span>
                        </div>
                    )}

                    <div className="converter-result">
                        <div className="result-label">{t('converter.result')}</div>
                        <div className="result-value">
                            {getCurrencyInfo(toCurrency)?.flag} {formatNumber(convertedAmount, 2, i18n.language)} {getCurrencyInfo(toCurrency)?.pair}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter;
