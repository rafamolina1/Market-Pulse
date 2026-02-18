import React, { useState, useCallback, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import './components/SettingsModal.css';
import CurrencyCard from './components/CurrencyCard';
import CryptoCard from './components/CryptoCard';
import CommodityCard from './components/CommodityCard';
import LiveIndicator from './components/LiveIndicator';
import SplashScreen from './components/SplashScreen';
import { useMarket } from './contexts/MarketContext';


const SettingsModal = React.lazy(() => import('./components/SettingsModal'));
const ChartModal = React.lazy(() => import('./components/ChartModal'));
const CurrencyConverter = React.lazy(() => import('./components/CurrencyConverter'));
const PortfolioModal = React.lazy(() => import('./components/PortfolioModal'));

function App() {
    const { t } = useTranslation();
    const [showSplash, setShowSplash] = useState(true);

    const handleSplashFinish = useCallback(() => {
        setShowSplash(false);
    }, []);

    const {
        currencies,
        cryptos,
        commodities,
        lastUpdate,
        loading,
        wsStatus,
        preferences,
        updatePreferences
    } = useMarket();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isChartOpen, setIsChartOpen] = useState(false);
    const [isConverterOpen, setIsConverterOpen] = useState(false);
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assetType, setAssetType] = useState(null);

    const handleOpenChart = (asset, type) => {
        setSelectedAsset(asset);
        setAssetType(type);
        setIsChartOpen(true);
    };

    const handleCloseChart = () => {
        setIsChartOpen(false);
        setSelectedAsset(null);
        setAssetType(null);
    };

    if (showSplash) {
        return <SplashScreen onFinish={handleSplashFinish} />;
    }

    if (loading && currencies.length === 0) {
        return (
            <div className="app">
                <div className="app-header">
                    <h1 className="app-title">Loading...</h1>
                </div>
            </div>
        );
    }

    const isRealTime = Object.values(wsStatus).some(status => status === 'connected');

    return (
        <div className="app">
            <header className="app-header">
                <div>
                    <h1 className="app-title">MarketPulse</h1>
                    <p className="app-subtitle">
                        {isRealTime ? `⚡ ${t('header.subtitleRealtime')}` : t('header.subtitle')}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        className="settings-button"
                        onClick={() => setIsPortfolioOpen(true)}
                    >
                        <span className="settings-icon">💼</span>
                        {t('buttons.portfolio')}
                    </button>
                    <button
                        data-testid="converter-button"
                        className="settings-button"
                        onClick={() => setIsConverterOpen(true)}
                        style={{ display: 'inline-flex', visibility: 'visible' }}
                    >
                        <span className="settings-icon">💱</span>
                        {t('buttons.converter')}
                    </button>
                    <button
                        data-testid="settings-button"
                        className="settings-button"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <span className="settings-icon">⚙️</span>
                        {t('buttons.settings')}
                    </button>
                </div>
            </header>


            {currencies.length > 0 && (
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="section-icon">💱</span>
                            Moedas Internacionais
                        </h2>
                        <LiveIndicator
                            lastUpdate={lastUpdate}
                            isRealTime={wsStatus.currency === 'connected'}
                        />
                    </div>
                    <div className="grid grid-cols-4">
                        {currencies
                            .filter(c => preferences.currencies.includes(c.target))
                            .map((currency, index) => (
                                <CurrencyCard
                                    key={index}
                                    pair={currency.pair}
                                    rate={currency.rate}
                                    change={currency.change}
                                    flag={currency.flag}
                                    onChartClick={() => handleOpenChart(currency, 'currency')}
                                />
                            ))}
                    </div>
                </section>
            )}


            {cryptos.length > 0 && (
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="section-icon">₿</span>
                            Criptomoedas
                        </h2>
                        <LiveIndicator
                            lastUpdate={lastUpdate}
                            isRealTime={wsStatus.crypto === 'connected'}
                        />
                    </div>
                    <div className="grid grid-cols-4">
                        {cryptos
                            .filter(c => preferences.cryptos.includes(c.id))
                            .map((crypto) => (
                                <CryptoCard
                                    key={crypto.id}
                                    name={crypto.name}
                                    symbol={crypto.symbol}
                                    image={crypto.image}
                                    current_price={crypto.current_price}
                                    price_change_percentage_24h={crypto.price_change_percentage_24h}
                                    market_cap={crypto.market_cap}
                                    onChartClick={() => handleOpenChart(crypto, 'crypto')}
                                />
                            ))}
                    </div>
                </section>
            )}


            {commodities.length > 0 && (
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="section-icon">🥇</span>
                            Commodities
                        </h2>
                        <LiveIndicator
                            lastUpdate={lastUpdate}
                            isRealTime={wsStatus.commodity === 'connected'}
                        />
                    </div>
                    <div className="grid grid-cols-4">
                        {commodities
                            .filter(c => preferences.commodities.includes(c.symbol))
                            .map((commodity) => (
                                <CommodityCard
                                    key={commodity.symbol}
                                    name={commodity.name}
                                    symbol={commodity.symbol}
                                    icon={commodity.icon}
                                    price={commodity.price}
                                    change={commodity.change}
                                    unit={commodity.unit}
                                    onChartClick={() => handleOpenChart(commodity, 'commodity')}
                                />
                            ))}
                    </div>
                </section>
            )}


            {currencies.length === 0 && cryptos.length === 0 && commodities.length === 0 && (
                <div className="empty-state">
                    <h2>Nenhum ativo selecionado</h2>
                    <p>Clique em "Configurar" para escolher os ativos que deseja acompanhar</p>
                    <button
                        className="settings-button"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <span className="settings-icon">⚙️</span>
                        Abrir Configurações
                    </button>
                </div>
            )}

            <Suspense fallback={<div className="modal-overlay"><div className="spinner"></div></div>}>
                {isSettingsOpen && (
                    <SettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                        preferences={preferences}
                        onSave={updatePreferences}
                    />
                )}

                {isChartOpen && (
                    <ChartModal
                        isOpen={isChartOpen}
                        onClose={handleCloseChart}
                        asset={selectedAsset}
                        assetType={assetType}
                    />
                )}

                {isConverterOpen && (
                    <CurrencyConverter
                        isOpen={isConverterOpen}
                        onClose={() => setIsConverterOpen(false)}
                    />
                )}

                {isPortfolioOpen && (
                    <PortfolioModal
                        isOpen={isPortfolioOpen}
                        onClose={() => setIsPortfolioOpen(false)}
                    />
                )}
            </Suspense>
        </div>
    );
}

export default App;
