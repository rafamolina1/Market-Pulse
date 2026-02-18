const PORTFOLIO_STORAGE_KEY = 'marketpulse-portfolio';

export const getPortfolio = () => {
    try {
        const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { holdings: [] };
    } catch (error) {
        console.error('Error loading portfolio:', error);
        return { holdings: [] };
    }
};

export const savePortfolio = (portfolio) => {
    try {
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
        return true;
    } catch (error) {
        console.error('Error saving portfolio:', error);
        return false;
    }
};

export const addAsset = (portfolio, asset) => {
    const newAsset = {
        id: `${asset.type}-${asset.assetId}-${Date.now()}`,
        ...asset,
        purchaseDate: new Date().toISOString()
    };

    const updatedPortfolio = {
        ...portfolio,
        holdings: [...portfolio.holdings, newAsset]
    };

    savePortfolio(updatedPortfolio);
    return updatedPortfolio;
};

export const updateAsset = (portfolio, assetId, updatedData) => {
    const updatedPortfolio = {
        ...portfolio,
        holdings: portfolio.holdings.map(holding =>
            holding.id === assetId ? { ...holding, ...updatedData } : holding
        )
    };

    savePortfolio(updatedPortfolio);
    return updatedPortfolio;
};

export const removeAsset = (portfolio, assetId) => {
    const updatedPortfolio = {
        ...portfolio,
        holdings: portfolio.holdings.filter(holding => holding.id !== assetId)
    };

    savePortfolio(updatedPortfolio);
    return updatedPortfolio;
};

export const calculateAssetPL = (asset, currentPrice) => {
    if (!currentPrice || !asset.purchasePrice || !asset.quantity) {
        return { profit: 0, profitPercent: 0, currentValue: 0, purchaseValue: 0 };
    }

    let currentValue, purchaseValue;

    if (asset.type === 'currency') {
        currentValue = asset.quantity / currentPrice;
        purchaseValue = asset.quantity / asset.purchasePrice;
    } else {
        currentValue = asset.quantity * currentPrice;
        purchaseValue = asset.quantity * asset.purchasePrice;
    }

    const profit = currentValue - purchaseValue;
    const profitPercent = purchaseValue > 0 ? (profit / purchaseValue) * 100 : 0;

    return {
        currentValue,
        purchaseValue,
        profit,
        profitPercent
    };
};

export const calculatePortfolioValue = (portfolio, currentPrices) => {
    let totalCurrentValue = 0;
    let totalPurchaseValue = 0;

    portfolio.holdings.forEach(holding => {
        const currentPrice = getCurrentPriceForAsset(holding, currentPrices);
        if (currentPrice) {
            const { currentValue, purchaseValue } = calculateAssetPL(holding, currentPrice);
            totalCurrentValue += currentValue;
            totalPurchaseValue += purchaseValue;
        }
    });

    const totalProfit = totalCurrentValue - totalPurchaseValue;
    const totalProfitPercent = totalPurchaseValue > 0
        ? (totalProfit / totalPurchaseValue) * 100
        : 0;

    return {
        totalCurrentValue,
        totalPurchaseValue,
        totalProfit,
        totalProfitPercent
    };
};

const getCurrentPriceForAsset = (holding, currentPrices) => {
    const { currencies = [], cryptos = [], commodities = [] } = currentPrices;

    switch (holding.type) {
        case 'currency':
            const currency = currencies.find(c => c.target === holding.assetId);
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
};

export default {
    getPortfolio,
    savePortfolio,
    addAsset,
    updateAsset,
    removeAsset,
    calculateAssetPL,
    calculatePortfolioValue
};
