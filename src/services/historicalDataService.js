/**
 * Historical Data Service
 * Fetches and caches historical price data for different assets
 */

const CACHE_PREFIX = 'marketpulse_history_';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Get cached data if available and not expired
 */
function getCachedData(key) {
    try {
        const cached = localStorage.getItem(CACHE_PREFIX + key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_TTL) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }

        return data;
    } catch (error) {
        console.error('[Cache] Error reading cache:', error);
        return null;
    }
}

/**
 * Set cached data
 */
function setCachedData(key, data) {
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('[Cache] Error writing cache:', error);
    }
}

/**
 * Get number of days for time range
 */
function getDaysFromRange(timeRange) {
    const rangeMap = {
        '1D': 1,
        '7D': 7,
        '30D': 30,
        '1Y': 365,
        'ALL': 'max'
    };
    return rangeMap[timeRange] || 30;
}

/**
 * Fetch cryptocurrency historical data from CoinGecko
 */
export async function fetchCryptoHistory(cryptoId, timeRange = '30D') {
    const cacheKey = `crypto_${cryptoId}_${timeRange}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
        const days = getDaysFromRange(timeRange);
        const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch crypto history');

        const data = await response.json();

        // Format data for Chart.js
        const formatted = {
            labels: data.prices.map(([timestamp]) => new Date(timestamp)),
            prices: data.prices.map(([, price]) => price),
            volumes: data.total_volumes?.map(([, volume]) => volume) || []
        };

        setCachedData(cacheKey, formatted);
        return formatted;
    } catch (error) {
        console.error('[History] Error fetching crypto data:', error);
        // Return mock data as fallback
        return generateMockHistory(timeRange, 50000 + Math.random() * 10000);
    }
}

/**
 * Fetch currency historical data (mock)
 */
export async function fetchCurrencyHistory(currencyPair, timeRange = '30D') {
    const cacheKey = `currency_${currencyPair}_${timeRange}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // Base rates for different currencies
    const baseRates = {
        'USD/EUR': 1.09,
        'USD/GBP': 1.27,
        'USD/JPY': 0.0067,
        'USD/BRL': 0.20,
        'USD/CAD': 0.74,
        'USD/AUD': 0.65,
        'USD/CHF': 1.13,
        'USD/CNY': 0.14,
        'USD/INR': 0.012,
        'USD/MXN': 0.059,
        'USD/KRW': 0.00075,
        'USD/ARS': 0.0011
    };

    const baseRate = baseRates[currencyPair] || 1;
    const data = generateMockHistory(timeRange, baseRate, 0.05);

    setCachedData(cacheKey, data);
    return data;
}

/**
 * Fetch commodity historical data (mock)
 */
export async function fetchCommodityHistory(symbol, timeRange = '30D') {
    const cacheKey = `commodity_${symbol}_${timeRange}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const basePrices = {
        XAU: 2050,
        XAG: 25.50,
        WTI: 78.50,
        NG: 2.85,
        HG: 3.85,
        XPT: 920,
        XPD: 1050,
        ZC: 450,
        ZW: 620,
        KC: 185
    };

    const basePrice = basePrices[symbol] || 100;
    const data = generateMockHistory(timeRange, basePrice, 0.15);

    setCachedData(cacheKey, data);
    return data;
}

/**
 * Generate mock historical data
 */
function generateMockHistory(timeRange, basePrice, volatility = 0.1) {
    const days = getDaysFromRange(timeRange);
    // Reduce number of points for better performance
    const points = days === 1 ? 12 : days === 7 ? 24 : days === 30 ? 30 : Math.min(days, 100);

    const labels = [];
    const prices = [];
    const volumes = [];

    const now = Date.now();
    const interval = days === 1
        ? 2 * 60 * 60 * 1000 // 2 hours for 1D
        : (days * 24 * 60 * 60 * 1000) / points;

    let currentPrice = basePrice;

    for (let i = 0; i < points; i++) {
        const timestamp = now - (points - i) * interval;
        labels.push(new Date(timestamp));

        // Random walk with trend
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        currentPrice = Math.max(currentPrice + change, basePrice * 0.5);
        prices.push(currentPrice);

        // Generate volume data
        const volume = (Math.random() * 1000000) + 500000;
        volumes.push(volume);
    }

    return { labels, prices, volumes };
}

/**
 * Clear all cached historical data
 */
export function clearHistoryCache() {
    Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
}
