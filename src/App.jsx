import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import './components/SettingsModal.css';
import CurrencyCard from './components/CurrencyCard';
import CryptoCard from './components/CryptoCard';
import CommodityCard from './components/CommodityCard';
import LiveIndicator from './components/LiveIndicator';
import SplashScreen from './components/SplashScreen';
import { useMarket } from './contexts/MarketContext';

const loadSettingsModal = () => import('./components/SettingsModal');
const loadChartModal = () => import('./components/ChartModal');
const loadCurrencyConverter = () => import('./components/CurrencyConverter');
const loadPortfolioModal = () => import('./components/PortfolioModal');

const SettingsModal = React.lazy(loadSettingsModal);
const ChartModal = React.lazy(loadChartModal);
const CurrencyConverter = React.lazy(loadCurrencyConverter);
const PortfolioModal = React.lazy(loadPortfolioModal);

const getInitialSplashState = () => {
    if (typeof window === 'undefined') return true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenSplash = sessionStorage.getItem('marketpulse_splash_seen') === 'true';

    return !prefersReducedMotion && !hasSeenSplash;
};

function App() {
    const { t, i18n } = useTranslation();
    const [showSplash, setShowSplash] = useState(getInitialSplashState);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isChartOpen, setIsChartOpen] = useState(false);
    const [isConverterOpen, setIsConverterOpen] = useState(false);
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assetType, setAssetType] = useState(null);

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

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const preloadChunks = () => {
            loadSettingsModal();
            loadChartModal();
            loadCurrencyConverter();
            loadPortfolioModal();
        };

        if ('requestIdleCallback' in window) {
            const idleId = window.requestIdleCallback(preloadChunks, { timeout: 1500 });
            return () => window.cancelIdleCallback?.(idleId);
        }

        const timeoutId = window.setTimeout(preloadChunks, 1200);
        return () => window.clearTimeout(timeoutId);
    }, []);

    const visibleCurrencies = useMemo(
        () => currencies.filter((currency) => preferences.currencies.includes(currency.target)),
        [currencies, preferences.currencies]
    );
    const visibleCryptos = useMemo(
        () => cryptos.filter((crypto) => preferences.cryptos.includes(crypto.id)),
        [cryptos, preferences.cryptos]
    );
    const visibleCommodities = useMemo(
        () => commodities.filter((commodity) => preferences.commodities.includes(commodity.symbol)),
        [commodities, preferences.commodities]
    );

    const isRealTime = useMemo(
        () => Object.values(wsStatus).some((status) => status === 'connected'),
        [wsStatus]
    );
    const connectedStreams = useMemo(
        () => Object.values(wsStatus).filter((status) => status === 'connected').length,
        [wsStatus]
    );
    const trackedAssets = visibleCurrencies.length + visibleCryptos.length + visibleCommodities.length;
    const showcaseStack = useMemo(() => ['React 18', 'Vite', 'Chart.js', 'i18n', 'PWA', 'Context API'], []);

    const lastUpdateLabel = lastUpdate
        ? new Intl.DateTimeFormat(i18n.language, {
            hour: '2-digit',
            minute: '2-digit'
        }).format(lastUpdate)
        : t('common.loading');
    const statusLabel = isRealTime ? t('header.statusRealtime') : t('header.statusDelayed');
    const syncLabel = t('header.metrics.lastSync', { time: lastUpdateLabel });

    const handleSplashFinish = useCallback(() => {
        sessionStorage.setItem('marketpulse_splash_seen', 'true');
        setShowSplash(false);
    }, []);

    const handleOpenChart = useCallback((asset, type) => {
        setSelectedAsset(asset);
        setAssetType(type);
        setIsChartOpen(true);
    }, []);

    const handleCloseChart = useCallback(() => {
        setIsChartOpen(false);
        setSelectedAsset(null);
        setAssetType(null);
    }, []);

    if (showSplash) {
        return <SplashScreen onFinish={handleSplashFinish} />;
    }

    if (loading && currencies.length === 0) {
        return (
            <div className="app">
                <div className="app-shell">
                    <div className="app-loading-panel glass-card">
                        <p className="eyebrow">{t('header.kicker')}</p>
                        <h1 className="app-title">{t('common.loading')}</h1>
                        <p className="app-subtitle">{t('header.description')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <div className="app-shell">
                <header className="hero-panel glass-card">
                    <div className="hero-copy">
                        <p className="eyebrow">{t('header.kicker')}</p>
                        <h1 className="app-title">{t('header.title')}</h1>
                        <p className="app-subtitle">
                            {isRealTime ? t('header.subtitleRealtime') : t('header.subtitle')}
                        </p>
                        <p className="hero-description">{t('header.description')}</p>
                        <div className="hero-signal-row" aria-label="Dashboard highlights">
                            <div className="hero-signal-pill">
                                <span className="hero-signal-label">{t('header.metrics.status')}</span>
                                <strong>{statusLabel}</strong>
                            </div>
                            <div className="hero-signal-pill">
                                <span className="hero-signal-label">{t('header.metrics.trackedAssets')}</span>
                                <strong>{trackedAssets}</strong>
                            </div>
                            <div className="hero-signal-pill">
                                <span className="hero-signal-label">{t('header.metrics.liveStreams')}</span>
                                <strong>{connectedStreams}/3</strong>
                            </div>
                        </div>
                    </div>

                    <div className="hero-actions">
                        <button
                            className="settings-button hero-action-secondary"
                            onClick={() => setIsPortfolioOpen(true)}
                            aria-label={t('buttons.portfolio')}
                        >
                            <span className="settings-icon">💼</span>
                            {t('buttons.portfolio')}
                        </button>
                        <button
                            data-testid="converter-button"
                            className="settings-button"
                            onClick={() => setIsConverterOpen(true)}
                            aria-label={t('buttons.converter')}
                        >
                            <span className="settings-icon">💱</span>
                            {t('buttons.converter')}
                        </button>
                        <button
                            data-testid="settings-button"
                            className="settings-button"
                            onClick={() => setIsSettingsOpen(true)}
                            aria-label={t('buttons.settings')}
                        >
                            <span className="settings-icon">⚙️</span>
                            {t('buttons.settings')}
                        </button>
                    </div>

                    <div className="hero-metrics">
                        <div className="metric-card">
                            <span className="metric-label">{t('header.metrics.trackedAssets')}</span>
                            <strong className="metric-value">{trackedAssets}</strong>
                        </div>
                        <div className="metric-card">
                            <span className="metric-label">{t('header.metrics.liveStreams')}</span>
                            <strong className="metric-value">{connectedStreams}/3</strong>
                        </div>
                        <div className="metric-card metric-status">
                            <span className="metric-label">{t('header.metrics.status')}</span>
                            <strong className="metric-value">{statusLabel}</strong>
                            <span className="metric-caption">{syncLabel}</span>
                        </div>
                    </div>
                </header>

                {visibleCurrencies.length > 0 && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">
                                    <span className="section-icon">💱</span>
                                    {t('sections.currencies')}
                                </h2>
                                <p className="section-description">{t('sections.currencyDescription')}</p>
                            </div>
                            <LiveIndicator
                                lastUpdate={lastUpdate}
                                isRealTime={wsStatus.currency === 'connected'}
                            />
                        </div>
                        <div className="grid grid-cols-4">
                            {visibleCurrencies.map((currency) => (
                                <CurrencyCard
                                    key={currency.pair}
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

                {visibleCryptos.length > 0 && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">
                                    <span className="section-icon">₿</span>
                                    {t('sections.cryptos')}
                                </h2>
                                <p className="section-description">{t('sections.cryptoDescription')}</p>
                            </div>
                            <LiveIndicator
                                lastUpdate={lastUpdate}
                                isRealTime={wsStatus.crypto === 'connected'}
                            />
                        </div>
                        <div className="grid grid-cols-4">
                            {visibleCryptos.map((crypto) => (
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

                {visibleCommodities.length > 0 && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">
                                    <span className="section-icon">🥇</span>
                                    {t('sections.commodities')}
                                </h2>
                                <p className="section-description">{t('sections.commodityDescription')}</p>
                            </div>
                            <LiveIndicator
                                lastUpdate={lastUpdate}
                                isRealTime={wsStatus.commodity === 'connected'}
                            />
                        </div>
                        <div className="grid grid-cols-4">
                            {visibleCommodities.map((commodity) => (
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

                <section className="project-panel glass-card">
                    <div className="project-panel-copy">
                        <p className="eyebrow">{t('project.eyebrow')}</p>
                        <h2 className="section-title">{t('project.title')}</h2>
                        <p className="section-description">{t('project.description')}</p>
                    </div>

                    <div className="project-highlights">
                        <div className="project-highlight-card">
                            <span className="metric-label">{t('project.highlight1.label')}</span>
                            <strong className="metric-value project-highlight-value">{t('project.highlight1.value')}</strong>
                            <p className="metric-caption">{t('project.highlight1.description')}</p>
                        </div>
                        <div className="project-highlight-card">
                            <span className="metric-label">{t('project.highlight2.label')}</span>
                            <strong className="metric-value project-highlight-value">{t('project.highlight2.value')}</strong>
                            <p className="metric-caption">{t('project.highlight2.description')}</p>
                        </div>
                        <div className="project-highlight-card">
                            <span className="metric-label">{t('project.highlight3.label')}</span>
                            <strong className="metric-value project-highlight-value">{t('project.highlight3.value')}</strong>
                            <p className="metric-caption">{t('project.highlight3.description')}</p>
                        </div>
                    </div>

                    <div className="tech-stack">
                        {showcaseStack.map((item) => (
                            <span key={item} className="tech-pill">{item}</span>
                        ))}
                    </div>
                </section>

                {trackedAssets === 0 && (
                    <div className="empty-state">
                        <p className="eyebrow">{t('empty.eyebrow')}</p>
                        <h2>{t('empty.title')}</h2>
                        <p>{t('empty.description')}</p>
                        <button
                            className="settings-button"
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <span className="settings-icon">⚙️</span>
                            {t('empty.cta')}
                        </button>
                    </div>
                )}

                <footer className="app-footer">
                    <div>
                        <p className="footer-title">{t('footer.title')}</p>
                        <p className="footer-copy">{t('footer.description')}</p>
                    </div>
                    <p className="footer-signature">{t('footer.signature')}</p>
                </footer>
            </div>

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
