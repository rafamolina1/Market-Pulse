
export const AVAILABLE_COMMODITIES = [
    { name: 'Gold', symbol: 'XAU', unit: 'oz', icon: '🥇', basePrice: 2048.35 },
    { name: 'Silver', symbol: 'XAG', unit: 'oz', icon: '🥈', basePrice: 24.87 },
    { name: 'Oil (WTI)', symbol: 'WTI', unit: 'bbl', icon: '🛢️', basePrice: 78.92 },
    { name: 'Natural Gas', symbol: 'NG', unit: 'MMBtu', icon: '🔥', basePrice: 2.67 },
    { name: 'Copper', symbol: 'HG', unit: 'lb', icon: '🟤', basePrice: 3.85 },
    { name: 'Platinum', symbol: 'XPT', unit: 'oz', icon: '⚪', basePrice: 912.45 },
    { name: 'Palladium', symbol: 'XPD', unit: 'oz', icon: '⚫', basePrice: 1024.80 },
    { name: 'Corn', symbol: 'ZC', unit: 'bu', icon: '🌽', basePrice: 4.52 },
    { name: 'Wheat', symbol: 'ZW', unit: 'bu', icon: '🌾', basePrice: 5.87 },
    { name: 'Coffee', symbol: 'KC', unit: 'lb', icon: '☕', basePrice: 1.92 },
];

export const fetchCommodityData = async (selectedSymbols = ['XAU', 'XAG', 'WTI', 'NG']) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        return selectedSymbols.map(symbol => {
            const commodity = AVAILABLE_COMMODITIES.find(c => c.symbol === symbol);
            if (!commodity) return null;

            return {
                name: commodity.name,
                symbol: commodity.symbol,
                price: commodity.basePrice * (1 + (Math.random() - 0.5) * 0.01),
                unit: commodity.unit,
                change: (Math.random() - 0.5) * 3,
                icon: commodity.icon,
            };
        }).filter(Boolean);
    } catch (error) {
        console.error('Error fetching commodity data:', error);
        return [];
    }
};

export const getCommodityHistoricalData = (symbol, days = 7) => {
    const now = Date.now();
    const commodity = AVAILABLE_COMMODITIES.find(c => c.symbol === symbol);
    const basePrice = commodity?.basePrice || 100;

    return Array.from({ length: days * 24 }, (_, i) => ({
        timestamp: now - (days * 24 - i) * 3600000,
        price: basePrice * (1 + (Math.random() - 0.5) * 0.1),
    }));
};
