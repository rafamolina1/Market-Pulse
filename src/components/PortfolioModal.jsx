import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useMarket } from '../contexts/MarketContext';
import { calculatePortfolioValue, calculateAssetPL } from '../services/portfolioService';
import { exportToCSV, exportToPDF } from '../services/exportService';
import { AVAILABLE_CURRENCIES } from '../services/currencyService';
import { AVAILABLE_CRYPTOS } from '../services/cryptoService';
import { AVAILABLE_COMMODITIES } from '../services/commodityService';
import './PortfolioModal.css';

const PortfolioModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const {
        portfolio,
        addAsset,
        removeAsset,
        updateAsset,
        displayCurrency,
        setDisplayCurrency
    } = usePortfolio();

    const { currencies, cryptos, commodities } = useMarket();
    const currentPrices = { currencies, cryptos, commodities };

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        type: '',
        assetId: '',
        name: '',
        symbol: '',
        quantity: '',
        purchasePrice: ''
    });

    const formRef = useRef(null);

    useEffect(() => {
        if (isAdding && formRef.current) {
            setTimeout(() => {
                formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [isAdding, editingId]);



    if (!isOpen) return null;

    const getBrlRate = () => {
        const brlPair = currentPrices.currencies.find(c => c.target === 'brl' || c.target === 'BRL');
        return brlPair ? brlPair.rate : 5.0;
    };

    const convertValue = (valueInUSD) => {
        if (displayCurrency === 'BRL') {
            return valueInUSD * getBrlRate();
        }
        return valueInUSD;
    };

    const formatMoney = (value) => {
        return new Intl.NumberFormat(displayCurrency === 'BRL' ? 'pt-BR' : 'en-US', {
            style: 'currency',
            currency: displayCurrency
        }).format(value);
    };

    const handleTypeChange = (type) => {
        setFormData({
            type,
            assetId: '',
            name: '',
            symbol: '',
            quantity: '',
            purchasePrice: ''
        });
    };

    const handleAssetChange = (assetId) => {
        let asset;
        if (formData.type === 'currency') {
            asset = AVAILABLE_CURRENCIES.find(c => c.target === assetId);
            setFormData({
                ...formData,
                assetId,
                name: asset?.name || '',
                symbol: asset?.pair || ''
            });
        } else if (formData.type === 'crypto') {
            asset = AVAILABLE_CRYPTOS.find(c => c.id === assetId);
            setFormData({
                ...formData,
                assetId,
                name: asset?.name || '',
                symbol: asset?.symbol || ''
            });
        } else if (formData.type === 'commodity') {
            asset = AVAILABLE_COMMODITIES.find(c => c.symbol === assetId);
            setFormData({
                ...formData,
                assetId,
                name: asset?.name || '',
                symbol: asset?.symbol || ''
            });
        }
    };

    const handleAddAsset = () => {
        if (!formData.type || !formData.assetId || !formData.quantity || !formData.purchasePrice) {
            return;
        }

        const assetData = {
            type: formData.type,
            assetId: formData.assetId,
            name: formData.name,
            symbol: formData.symbol,
            quantity: parseFloat(formData.quantity),
            purchasePrice: parseFloat(formData.purchasePrice)
        };

        if (editingId) {
            updateAsset(editingId, assetData);
        } else {
            addAsset(assetData);
        }

        setFormData({
            type: '',
            assetId: '',
            name: '',
            symbol: '',
            quantity: '',
            purchasePrice: ''
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEditAsset = (holding) => {
        setEditingId(holding.id);
        setFormData({
            type: holding.type,
            assetId: holding.assetId,
            name: holding.name,
            symbol: holding.symbol,
            quantity: holding.quantity,
            purchasePrice: holding.purchasePrice
        });
        setIsAdding(true);
    };

    const handleDeleteAsset = (assetId) => {
        removeAsset(assetId);
        if (editingId === assetId) {
            setIsAdding(false);
            setEditingId(null);
            setFormData({ type: '', assetId: '', name: '', symbol: '', quantity: '', purchasePrice: '' });
        }
    };

    const getAvailableAssets = () => {
        switch (formData.type) {
            case 'currency':
                return AVAILABLE_CURRENCIES.map(c => ({ id: c.target, name: c.name, symbol: c.pair }));
            case 'crypto':
                return AVAILABLE_CRYPTOS.map(c => ({ id: c.id, name: c.name, symbol: c.symbol }));
            case 'commodity':
                return AVAILABLE_COMMODITIES.map(c => ({ id: c.symbol, name: c.name, symbol: c.symbol }));
            default:
                return [];
        }
    };

    const getCurrentPrice = useCallback((holding) => {
        const { currencies = [], cryptos = [], commodities = [] } = currentPrices;

        switch (holding.type) {
            case 'currency':
                const currency = currencies.find(c =>
                    c.target === holding.assetId ||
                    (c.target && holding.assetId && c.target.toLowerCase() === holding.assetId.toLowerCase())
                );
                return currency?.rate || null;
            case 'crypto':
                const crypto = cryptos.find(c => c.id === holding.assetId);
                return crypto?.current_price || crypto?.price || null;
            case 'commodity':
                const commodity = commodities.find(c => c.symbol === holding.assetId);
                return commodity?.price || null;
            default:
                return null;
        }
    }, [currentPrices]);

    const portfolioStats = useMemo(() => {
        return calculatePortfolioValue(portfolio, currentPrices);
    }, [portfolio, currentPrices]);

    const handleExport = (type) => {
        const brlRate = getBrlRate();
        if (type === 'csv') {
            exportToCSV(portfolio, currentPrices, displayCurrency, brlRate);
        } else {
            exportToPDF(portfolio, currentPrices, displayCurrency, brlRate);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="portfolio-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">💼 {t('portfolio.title')}</h2>
                    <div className="header-actions">
                        <div className="currency-toggle">
                            <span className="toggle-label">{t('portfolio.displayCurrency')}</span>
                            <div className="toggle-buttons">
                                <button
                                    className={`toggle-btn ${displayCurrency === 'USD' ? 'active' : ''}`}
                                    onClick={() => setDisplayCurrency('USD')}
                                >
                                    USD ($)
                                </button>
                                <button
                                    className={`toggle-btn ${displayCurrency === 'BRL' ? 'active' : ''}`}
                                    onClick={() => setDisplayCurrency('BRL')}
                                >
                                    BRL (R$)
                                </button>
                            </div>
                        </div>
                        <div className="export-actions">
                            <button
                                className="btn-export"
                                onClick={() => handleExport('csv')}
                                title={t('buttons.exportCSV')}
                            >
                                📊 CSV
                            </button>
                            <button
                                className="btn-export"
                                onClick={() => handleExport('pdf')}
                                title={t('buttons.exportPDF')}
                            >
                                📄 PDF
                            </button>
                        </div>
                        <button className="modal-close" onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className="modal-body portfolio-body">
                    <div className="portfolio-summary">
                        <div className="summary-card">
                            <div className="summary-label">{t('portfolio.totalValue')}</div>
                            <div className="summary-value">
                                {formatMoney(convertValue(portfolioStats.totalCurrentValue))}
                            </div>
                            <div className={`summary-pl ${portfolioStats.totalProfit >= 0 ? 'positive' : 'negative'}`}>
                                {portfolioStats.totalProfit >= 0 ? '🟢' : '🔴'} {formatMoney(convertValue(portfolioStats.totalProfit))}
                                {' '}({portfolioStats.totalProfitPercent.toFixed(2)}%)
                            </div>
                        </div>
                    </div>

                    {!isAdding && (
                        <button className="btn-add-asset" onClick={() => {
                            setIsAdding(true);
                            setEditingId(null);
                            setFormData({ type: '', assetId: '', name: '', symbol: '', quantity: '', purchasePrice: '' });
                        }}>
                            + {t('portfolio.addAsset')}
                        </button>
                    )}

                    {isAdding && (
                        <div ref={formRef} className="add-asset-form glass-card">
                            <>
                                <h3>{editingId ? '✏️ ' + t('buttons.edit') : '➕ ' + t('portfolio.addAsset')}</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>{t('portfolio.assetType')}</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => handleTypeChange(e.target.value)}
                                            disabled={!!editingId}
                                        >
                                            <option value="">{t('portfolio.selectType')}</option>
                                            <option value="currency">{t('portfolio.currency')}</option>
                                            <option value="crypto">{t('portfolio.crypto')}</option>
                                            <option value="commodity">{t('portfolio.commodity')}</option>
                                        </select>
                                    </div>



                                    {formData.type && (
                                        <div className="form-group">
                                            <label>{t('portfolio.asset')}</label>
                                            <select
                                                value={formData.assetId}
                                                onChange={(e) => handleAssetChange(e.target.value)}
                                                disabled={!!editingId}
                                            >
                                                <option value="">{t('portfolio.selectAsset')}</option>
                                                {getAvailableAssets().map(asset => (
                                                    <option key={asset.id} value={asset.id}>
                                                        {asset.name} ({asset.symbol})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label>
                                            {formData.type === 'currency'
                                                ? t('portfolio.amount') + ` (${formData.assetId ? formData.assetId.toUpperCase() : ''})`
                                                : t('portfolio.quantity')}
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            {formData.type === 'currency'
                                                ? t('portfolio.exchangeRate')
                                                : t('portfolio.purchasePrice') + ' (USD)'}
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.purchasePrice}
                                            onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                                            placeholder="0.00"
                                        />
                                        {formData.type === 'currency' && formData.assetId && (
                                            <small className="helper-text">
                                                How many {formData.assetId.toUpperCase()} per 1 USD
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button className="btn-cancel" onClick={() => {
                                        setIsAdding(false);
                                        setEditingId(null);
                                        setFormData({ type: '', assetId: '', name: '', symbol: '', quantity: '', purchasePrice: '' });
                                    }}>
                                        {t('buttons.cancel')}
                                    </button>
                                    <button className="btn-save" onClick={handleAddAsset}>
                                        {editingId ? t('buttons.save') : t('buttons.save')}
                                    </button>
                                </div>
                            </>
                        </div>
                    )}

                    <div className="holdings-list">
                        {portfolio.holdings.length === 0 ? (
                            <div className="empty-state">
                                <p>📊 {t('portfolio.noAssets')}</p>
                            </div>
                        ) : (
                            portfolio.holdings.map(holding => {
                                const currentPrice = getCurrentPrice(holding);
                                const pl = calculateAssetPL(holding, currentPrice);

                                return (
                                    <div key={holding.id} className="holding-card glass-card">
                                        <div className="holding-header">
                                            <div className="holding-info">
                                                <h4>{holding.name} ({holding.symbol})</h4>
                                                <span className="holding-type-badge">{t(`portfolio.${holding.type}`)}</span>
                                            </div>
                                            <div className="holding-actions">

                                                <button
                                                    className="btn-edit-small"
                                                    onClick={() => handleEditAsset(holding)}
                                                    title={t('buttons.edit')}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-delete-small"
                                                    onClick={() => handleDeleteAsset(holding.id)}
                                                    title={t('portfolio.delete')}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        <div className="holding-details">
                                            <div className="detail-row">
                                                <span>{holding.quantity} × {formatMoney(convertValue(currentPrice || 0))}</span>
                                                <strong>{formatMoney(convertValue(pl.currentValue || 0))}</strong>
                                            </div>
                                            <div className="detail-row purchase">
                                                <span>{t('portfolio.purchasePrice')}: {formatMoney(convertValue(holding.purchasePrice))}</span>
                                            </div>
                                            <div className={`detail-row pl ${pl.profit >= 0 ? 'positive' : 'negative'}`}>
                                                <span>{t('portfolio.profitLoss')}:</span>
                                                <strong>
                                                    {pl.profit >= 0 ? '🟢' : '🔴'} {formatMoney(convertValue(pl.profit))}
                                                    {' '}({pl.profitPercent >= 0 ? '+' : ''}{pl.profitPercent.toFixed(2)}%)
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioModal;
