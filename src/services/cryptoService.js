const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const AVAILABLE_CRYPTOS = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '◆' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', icon: 'S' },
    { id: 'ripple', symbol: 'XRP', name: 'XRP', icon: 'X' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳' },
    { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', icon: 'A' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '●' },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', icon: '⬡' },
    { id: 'polygon', symbol: 'MATIC', name: 'Polygon', icon: 'M' },
    { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', icon: 'Ł' },
    { id: 'stellar', symbol: 'XLM', name: 'Stellar', icon: '*' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð' },
    { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', icon: '⚛' },
    { id: 'tron', symbol: 'TRX', name: 'TRON', icon: 'T' },
    { id: 'the-open-network', symbol: 'TON', name: 'Toncoin', icon: '◇' },
    { id: 'sui', symbol: 'SUI', name: 'Sui', icon: 'S' },
    { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', icon: '🦄' },
    { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕' },
    { id: 'pepe', symbol: 'PEPE', name: 'Pepe', icon: '🐸' },
    { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', icon: 'B' },
    { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', icon: '🔵' },
    { id: 'optimism', symbol: 'OP', name: 'Optimism', icon: '🔴' },
    { id: 'aptos', symbol: 'APT', name: 'Aptos', icon: 'A' },
    { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', icon: 'F' },
    { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', icon: 'N' },
    { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera', icon: 'H' },
    { id: 'vechain', symbol: 'VET', name: 'VeChain', icon: 'V' },
    { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', icon: 'I' },
    { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic', icon: 'E' },
];

const generateMockCrypto = (crypto) => ({
    id: crypto.id,
    symbol: crypto.symbol,
    name: crypto.name,
    current_price: Math.random() * 50000 + 100,
    price_change_percentage_24h: (Math.random() - 0.5) * 10,
    market_cap: Math.random() * 1000000000000,
    image: crypto.icon,
});

export const fetchCryptoData = async (selectedIds = ['bitcoin', 'ethereum', 'binancecoin', 'solana']) => {
    try {
        const idsString = selectedIds.join(',');
        const response = await fetch(
            `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${idsString}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
        );

        if (!response.ok) {
            throw new Error('API rate limit or error');
        }

        const data = await response.json();

        return data.map(crypto => {
            const cryptoInfo = AVAILABLE_CRYPTOS.find(c => c.id === crypto.id);
            return {
                id: crypto.id,
                symbol: crypto.symbol.toUpperCase(),
                name: crypto.name,
                current_price: crypto.current_price,
                price_change_percentage_24h: crypto.price_change_percentage_24h,
                market_cap: crypto.market_cap,
                image: cryptoInfo?.icon || crypto.symbol[0].toUpperCase(),
            };
        });
    } catch (error) {
        console.warn('Failed to fetch crypto data, using mock data:', error);
        return selectedIds.map(id => {
            const crypto = AVAILABLE_CRYPTOS.find(c => c.id === id);
            return crypto ? generateMockCrypto(crypto) : null;
        }).filter(Boolean);
    }
};

export const fetchCryptoHistoricalData = async (cryptoId, days = 7) => {
    try {
        const response = await fetch(
            `${COINGECKO_API}/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}`
        );

        if (!response.ok) {
            throw new Error('API error');
        }

        const data = await response.json();
        return data.prices.map(([timestamp, price]) => ({
            timestamp,
            price,
        }));
    } catch (error) {
        console.warn('Failed to fetch historical data:', error);
        const now = Date.now();
        return Array.from({ length: days * 24 }, (_, i) => ({
            timestamp: now - (days * 24 - i) * 3600000,
            price: 50000 + Math.random() * 5000,
        }));
    }
};
