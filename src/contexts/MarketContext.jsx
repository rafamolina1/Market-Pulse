import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { fetchCurrencyRates, AVAILABLE_CURRENCIES } from '../services/currencyService';
import { fetchCryptoData, AVAILABLE_CRYPTOS } from '../services/cryptoService';
import { fetchCommodityData, AVAILABLE_COMMODITIES } from '../services/commodityService';
import {
    createCurrencyWebSocket,
    createCryptoWebSocket,
    createCommodityWebSocket
} from '../services/websocketService';

const MarketContext = createContext();

export const useMarket = () => {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarket must be used within a MarketProvider');
    }
    return context;
};

const DEFAULT_PREFERENCES = {
    currencies: ['eur', 'gbp', 'jpy', 'brl'],
    cryptos: ['bitcoin', 'ethereum', 'binancecoin', 'solana'],
    commodities: ['XAU', 'XAG', 'WTI', 'NG'],
};

export const MarketProvider = ({ children }) => {
    const [currencies, setCurrencies] = useState([]);
    const [cryptos, setCryptos] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wsStatus, setWsStatus] = useState({
        crypto: 'disconnected',
        currency: 'disconnected',
        commodity: 'disconnected'
    });

    const [preferences, setPreferences] = useState(() => {
        try {
            const saved = localStorage.getItem('marketpulse_preferences');
            return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
        } catch (error) {
            console.error('Error loading preferences:', error);
            return DEFAULT_PREFERENCES;
        }
    });

    const wsConnections = useRef({
        crypto: null,
        currency: null,
        commodity: null
    });

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            const [currencyData, cryptoData, commodityData] = await Promise.all([
                fetchCurrencyRates(AVAILABLE_CURRENCIES.map(c => c.target)),
                fetchCryptoData(AVAILABLE_CRYPTOS.map(c => c.id)),
                fetchCommodityData(AVAILABLE_COMMODITIES.map(c => c.symbol)),
            ]);

            setCurrencies(currencyData);
            setCryptos(cryptoData);
            setCommodities(commodityData);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const setupWebSockets = useCallback(() => {
        Object.values(wsConnections.current).forEach(ws => {
            if (ws?.close) ws.close();
        });

        if (preferences.currencies.length > 0) {
            wsConnections.current.currency = createCurrencyWebSocket(
                preferences.currencies,
                (data) => {
                    setCurrencies(prev => {
                        const newCurrencies = [...prev];
                        data.forEach(updatedItem => {
                            const index = newCurrencies.findIndex(c => c.target === updatedItem.target);
                            if (index !== -1) {
                                newCurrencies[index] = { ...newCurrencies[index], ...updatedItem };
                            }
                        });
                        return newCurrencies;
                    });
                    setLastUpdate(new Date());
                }
            );
            setWsStatus(prev => ({ ...prev, currency: 'connected' }));
        }

        if (preferences.cryptos.length > 0) {
            wsConnections.current.crypto = createCryptoWebSocket(
                preferences.cryptos,
                (data) => {
                    setCryptos(prev => {
                        const newCryptos = [...prev];
                        data.forEach(updatedItem => {
                            const index = newCryptos.findIndex(c => c.id === updatedItem.id);
                            if (index !== -1) {
                                newCryptos[index] = { ...newCryptos[index], ...updatedItem };
                            }
                        });
                        return newCryptos;
                    });
                    setLastUpdate(new Date());
                }
            );

            const checkStatus = setInterval(() => {
                const status = wsConnections.current.crypto?.getStatus?.() || 'connected';
                setWsStatus(prev => ({ ...prev, crypto: status }));
            }, 1000);

            return () => clearInterval(checkStatus);
        }

        if (preferences.commodities.length > 0) {
            wsConnections.current.commodity = createCommodityWebSocket(
                preferences.commodities,
                (data) => {
                    setCommodities(prev => {
                        const newCommodities = [...prev];
                        data.forEach(updatedItem => {
                            const index = newCommodities.findIndex(c => c.symbol === updatedItem.symbol);
                            if (index !== -1) {
                                newCommodities[index] = { ...newCommodities[index], ...updatedItem };
                            }
                        });
                        return newCommodities;
                    });
                    setLastUpdate(new Date());
                }
            );
            setWsStatus(prev => ({ ...prev, commodity: 'connected' }));
        }
    }, [preferences]);

    const updatePreferences = useCallback((newPreferences) => {
        setPreferences(newPreferences);
        localStorage.setItem('marketpulse_preferences', JSON.stringify(newPreferences));
    }, []);

    useEffect(() => {
        fetchAllData();
        const timer = setTimeout(() => {
            setupWebSockets();
        }, 1000);

        return () => {
            clearTimeout(timer);
            Object.values(wsConnections.current).forEach(ws => {
                if (ws?.close) ws.close();
            });
        };
    }, [preferences, fetchAllData, setupWebSockets]);

    const value = React.useMemo(() => ({
        currencies,
        cryptos,
        commodities,
        lastUpdate,
        loading,
        wsStatus,
        preferences,
        updatePreferences,
        refresh: fetchAllData
    }), [
        currencies,
        cryptos,
        commodities,
        lastUpdate,
        loading,
        wsStatus,
        preferences,
        updatePreferences,
        fetchAllData
    ]);

    return (
        <MarketContext.Provider value={value}>
            {children}
        </MarketContext.Provider>
    );
};

export default MarketContext;
