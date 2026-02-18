import React, { createContext, useContext, useState, useEffect } from 'react';
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

    const addAsset = (assetData) => {
        const newPortfolio = addAssetToPortfolio(portfolio, assetData);
        setPortfolio(newPortfolio);
    };

    const updateAsset = (id, assetData) => {
        const newPortfolio = updateAssetInPortfolio(portfolio, id, assetData);
        setPortfolio(newPortfolio);
    };

    const removeAsset = (id) => {
        const newPortfolio = removeAssetFromPortfolio(portfolio, id);
        setPortfolio(newPortfolio);
    };


    return (
        <PortfolioContext.Provider value={{
            portfolio,
            displayCurrency,
            setDisplayCurrency,
            addAsset,
            updateAsset,
            removeAsset
        }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export default PortfolioContext;
