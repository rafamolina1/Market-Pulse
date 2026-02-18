import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMarket } from '../contexts/MarketContext';
import { AVAILABLE_CURRENCIES } from '../services/currencyService';
import './CurrencyConverter.css';

const CurrencyConverter = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { currencies: currentRates } = useMarket();
    const [fromCurrency, setFromCurrency] = useState('usd');
    const [toCurrency, setToCurrency] = useState('eur');
    const [amount, setAmount] = useState(100);

    const rates = currentRates.length > 0 ? currentRates : [
        { target: 'USD', rate: 1, pair: 'USD/USD' },
        { target: 'BRL', rate: 5.0, pair: 'USD/BRL' },
        { target: 'EUR', rate: 0.92, pair: 'USD/EUR' }
    ];
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0);

    const allCurrencies = [
        { target: 'usd', name: 'US Dollar', pair: 'USD', flag: '🇺🇸' },
        ...AVAILABLE_CURRENCIES.map(c => ({
            ...c,
            pair: c.target.toUpperCase()
        }))
    ];

    useEffect(() => {
        if (isOpen && amount && currentRates) {
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
        if (!currentRates || currentRates.length === 0) {
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
            <div className="converter-modal" onClick={(e) => e.stopPropagation()}>
                <div className="converter-header">
                    <h2 className="converter-title">💱 Currency Converter</h2>
                    <button className="converter-close" onClick={onClose}>✕</button>
                </div>

                <div className="converter-body">
                    <div className="converter-section">
                        <label className="converter-label">Amount</label>
                        <input
                            type="number"
                            className="converter-input"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="Enter amount"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="converter-section">
                        <label className="converter-label">From</label>
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
                        <button className="converter-swap-btn" onClick={handleSwap}>
                            🔄
                        </button>
                    </div>

                    <div className="converter-section">
                        <label className="converter-label">To</label>
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
                            <span className="rate-label">Exchange Rate:</span>
                            <span className="rate-value">
                                1 {getCurrencyInfo(fromCurrency)?.pair} = {exchangeRate.toFixed(6)} {getCurrencyInfo(toCurrency)?.pair}
                            </span>
                        </div>
                    )}

                    <div className="converter-result">
                        <div className="result-label">Converted Amount</div>
                        <div className="result-value">
                            {getCurrencyInfo(toCurrency)?.flag} {convertedAmount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })} {getCurrencyInfo(toCurrency)?.pair}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter;
