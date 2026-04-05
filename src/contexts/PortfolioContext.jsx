import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    getPortfolio,
    addAsset as addAssetToPortfolio,
    removeAsset as removeAssetFromPortfolio,
    updateAsset as updateAssetInPortfolio
} from '../services/portfolioService';

const PortfolioContext = createContext();

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};

export const PortfolioProvider = ({ children }) => {
    const [portfolio, setPortfolio] = useState(() => getPortfolio());

    const [displayCurrency, setDisplayCurrency] = useState(() => localStorage.getItem('marketpulse-portfolio-currency') || 'USD');

    useEffect(() => {
        localStorage.setItem('marketpulse-portfolio-currency', displayCurrency);
    }, [displayCurrency]);

    const addAsset = useCallback((assetData) => {
        const newPortfolio = addAssetToPortfolio(portfolio, assetData);
        setPortfolio(newPortfolio);
    }, [portfolio]);

    const updateAsset = useCallback((id, assetData) => {
        const newPortfolio = updateAssetInPortfolio(portfolio, id, assetData);
        setPortfolio(newPortfolio);
    }, [portfolio]);

    const removeAsset = useCallback((id) => {
        const newPortfolio = removeAssetFromPortfolio(portfolio, id);
        setPortfolio(newPortfolio);
    }, [portfolio]);

    const value = useMemo(() => ({
        portfolio,
        displayCurrency,
        setDisplayCurrency,
        addAsset,
        updateAsset,
        removeAsset
    }), [
        portfolio,
        displayCurrency,
        addAsset,
        updateAsset,
        removeAsset
    ]);

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
};

export default PortfolioContext;
