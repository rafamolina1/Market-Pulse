
class WebSocketManager {
    constructor() {
        this.connections = new Map();
        this.reconnectAttempts = new Map();
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // Start with 1 second
    }

    connect(name, url, options = {}) {
        const {
            onMessage,
            onOpen,
            onClose,
            onError,
            reconnect = true,
        } = options;

        if (this.connections.has(name)) {
            this.disconnect(name);
        }

        try {
            const ws = new WebSocket(url);

            ws.onopen = (event) => {
                console.log(`[WebSocket] ${name} connected`);
                this.reconnectAttempts.set(name, 0);
                if (onOpen) onOpen(event);
            };

            ws.onmessage = (event) => {
                if (onMessage) {
                    try {
                        const data = JSON.parse(event.data);
                        onMessage(data);
                    } catch (error) {
                        console.error(`[WebSocket] ${name} message parse error:`, error);
                    }
                }
            };

            ws.onerror = (error) => {
                console.error(`[WebSocket] ${name} error:`, error);
                if (onError) onError(error);
            };

            ws.onclose = (event) => {
                console.log(`[WebSocket] ${name} closed`);
                this.connections.delete(name);

                if (onClose) onClose(event);

                if (reconnect && !event.wasClean) {
                    this.attemptReconnect(name, url, options);
                }
            };

            this.connections.set(name, ws);
            return ws;
        } catch (error) {
            console.error(`[WebSocket] ${name} connection failed:`, error);
            if (onError) onError(error);
            return null;
        }
    }

    attemptReconnect(name, url, options) {
        const attempts = this.reconnectAttempts.get(name) || 0;

        if (attempts >= this.maxReconnectAttempts) {
            console.error(`[WebSocket] ${name} max reconnection attempts reached`);
            return;
        }

        const delay = this.reconnectDelay * Math.pow(2, attempts);
        console.log(`[WebSocket] ${name} reconnecting in ${delay}ms (attempt ${attempts + 1})`);

        setTimeout(() => {
            this.reconnectAttempts.set(name, attempts + 1);
            this.connect(name, url, options);
        }, delay);
    }

    disconnect(name) {
        const ws = this.connections.get(name);
        if (ws) {
            ws.close();
            this.connections.delete(name);
        }
    }

    send(name, data) {
        const ws = this.connections.get(name);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
            return true;
        }
        return false;
    }

    getStatus(name) {
        const ws = this.connections.get(name);
        if (!ws) return 'disconnected';

        switch (ws.readyState) {
            case WebSocket.CONNECTING: return 'connecting';
            case WebSocket.OPEN: return 'connected';
            case WebSocket.CLOSING: return 'closing';
            case WebSocket.CLOSED: return 'disconnected';
            default: return 'unknown';
        }
    }

    disconnectAll() {
        this.connections.forEach((ws, name) => {
            this.disconnect(name);
        });
    }
}

const wsManager = new WebSocketManager();

export const createCurrencyWebSocket = (selectedCurrencies, onUpdate) => {
    const currencies = ['eur', 'gbp', 'jpy', 'brl', 'cad', 'aud', 'chf', 'cny', 'inr', 'mxn', 'krw', 'ars'];
    const basePrices = {
        eur: 1.09, gbp: 1.27, jpy: 0.0067, brl: 0.20,
        cad: 0.74, aud: 0.65, chf: 1.13, cny: 0.14,
        inr: 0.012, mxn: 0.059, krw: 0.00075, ars: 0.0011
    };

    let intervalId = setInterval(() => {
        const updates = selectedCurrencies.map(currency => {
            const base = basePrices[currency] || 1;
            const rate = base * (1 + fluctuation);

            return {
                pair: `USD/${currency.toUpperCase()}`,
                rate: rate,
                change: change,
                flag: getCurrencyFlag(currency)
            };
        });

        onUpdate(updates);
    }, 5000);

    return {
        close: () => clearInterval(intervalId),
        status: 'connected'
    };
};

export const createCommodityWebSocket = (selectedCommodities, onUpdate) => {
    const basePrices = {
        XAU: 2050, XAG: 25.50, WTI: 78.50, NG: 2.85,
        HG: 3.85, XPT: 920, XPD: 1050, ZC: 450,
        ZW: 620, KC: 185
    };

    let intervalId = setInterval(() => {
        const updates = selectedCommodities.map(symbol => {
            const base = basePrices[symbol] || 100;
            const fluctuation = (Math.random() - 0.5) * 0.03;
            const price = base * (1 + fluctuation);
            const change = (Math.random() - 0.5) * 5;

            return {
                symbol,
                name: getCommodityName(symbol),
                price,
                unit: getCommodityUnit(symbol),
                change,
                icon: getCommodityIcon(symbol)
            };
        });

        onUpdate(updates);
    }, 8000);

    return {
        close: () => clearInterval(intervalId),
        status: 'connected'
    };
};

export const createCryptoWebSocket = (selectedCryptos, onUpdate) => {
    const symbolMap = {
        bitcoin: 'btcusdt',
        ethereum: 'ethusdt',
        binancecoin: 'bnbusdt',
        solana: 'solusdt',
        ripple: 'xrpusdt',
        cardano: 'adausdt',
        'avalanche-2': 'avaxusdt',
        polkadot: 'dotusdt',
        chainlink: 'linkusdt',
        polygon: 'maticusdt',
        litecoin: 'ltcusdt',
        stellar: 'xlmusdt',
        dogecoin: 'dogeusdt',
        cosmos: 'atomusdt',
        tron: 'trxusdt',
        'the-open-network': 'tonusdt',
        sui: 'suiusdt',
        uniswap: 'uniusdt',
        'shiba-inu': 'shibusdt',
        pepe: 'pepeusdt',
        'bitcoin-cash': 'bchusdt',
        arbitrum: 'arbusdt',
        optimism: 'opusdt',
        aptos: 'aptusdt',
        filecoin: 'filusdt',
        near: 'nearusdt',
        'hedera-hashgraph': 'hbarusdt',
        vechain: 'vetusdt',
        'internet-computer': 'icpusdt',
        'ethereum-classic': 'etcusdt'
    };

    const nameMap = {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum',
        binancecoin: 'Binance Coin',
        solana: 'Solana',
        ripple: 'XRP',
        cardano: 'Cardano',
        'avalanche-2': 'Avalanche',
        polkadot: 'Polkadot',
        chainlink: 'Chainlink',
        polygon: 'Polygon',
        litecoin: 'Litecoin',
        stellar: 'Stellar',
        dogecoin: 'Dogecoin',
        cosmos: 'Cosmos',
        tron: 'TRON',
        // New additions
        'the-open-network': 'Toncoin',
        sui: 'Sui',
        uniswap: 'Uniswap',
        'shiba-inu': 'Shiba Inu',
        pepe: 'Pepe',
        'bitcoin-cash': 'Bitcoin Cash',
        arbitrum: 'Arbitrum',
        optimism: 'Optimism',
        aptos: 'Aptos',
        filecoin: 'Filecoin',
        near: 'NEAR Protocol',
        'hedera-hashgraph': 'Hedera',
        vechain: 'VeChain',
        'internet-computer': 'Internet Computer',
        'ethereum-classic': 'Ethereum Classic'
    };

    const imageMap = {
        bitcoin: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        ethereum: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        binancecoin: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
        solana: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        ripple: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
        cardano: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
        'avalanche-2': 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
        polkadot: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
        chainlink: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
        polygon: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
        litecoin: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
        stellar: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
        dogecoin: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
        cosmos: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
        tron: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
        // New additions
        'the-open-network': 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
        sui: 'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg',
        uniswap: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
        'shiba-inu': 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
        pepe: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
        'bitcoin-cash': 'https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png',
        arbitrum: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
        optimism: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
        aptos: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png',
        filecoin: 'https://assets.coingecko.com/coins/images/12817/small/filecoin.png',
        near: 'https://assets.coingecko.com/coins/images/10365/small/near_icon.png',
        'hedera-hashgraph': 'https://assets.coingecko.com/coins/images/3688/small/hbar.png',
        vechain: 'https://assets.coingecko.com/coins/images/1167/small/VeChain-Logo-768x725.png',
        'internet-computer': 'https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png',
        'ethereum-classic': 'https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png'
    };

    const streams = selectedCryptos
        .filter(id => symbolMap[id])
        .map(id => `${symbolMap[id]}@ticker`)
        .join('/');

    if (!streams) {
        console.warn('[WebSocket] No valid crypto symbols for WebSocket');
        return createCryptoFallback(selectedCryptos, onUpdate);
    }

    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    const cryptoData = new Map();

    wsManager.connect('crypto', url, {
        onMessage: (data) => {
            if (data.stream && data.data) {
                const ticker = data.data;
                const symbol = ticker.s.toLowerCase();

                const cryptoId = Object.keys(symbolMap).find(
                    id => symbolMap[id] === symbol
                );

                if (cryptoId) {
                    cryptoData.set(cryptoId, {
                        id: cryptoId,
                        symbol: ticker.s.replace('USDT', ''),
                        name: nameMap[cryptoId] || cryptoId,
                        current_price: parseFloat(ticker.c),
                        price_change_percentage_24h: parseFloat(ticker.P),
                        market_cap: parseFloat(ticker.c) * parseFloat(ticker.v),
                        image: imageMap[cryptoId]
                    });

                    onUpdate(Array.from(cryptoData.values()));
                }
            }
        },
        onOpen: () => console.log('[WebSocket] Crypto stream connected'),
        onError: (error) => console.error('[WebSocket] Crypto error:', error),
        onClose: () => console.log('[WebSocket] Crypto stream closed')
    });

    return {
        close: () => wsManager.disconnect('crypto'),
        getStatus: () => wsManager.getStatus('crypto')
    };
};

function createCryptoFallback(selectedCryptos, onUpdate) {
    console.log('[WebSocket] Using crypto fallback (simulated)');

    const basePrices = {
        bitcoin: 51000,
        ethereum: 2800,
        binancecoin: 350,
        solana: 105,
        ripple: 0.52,
        cardano: 0.48,
        avalanche: 36,
        polkadot: 7.2,
        chainlink: 15.5,
        'matic-network': 0.85,
        polygon: 0.85,
        litecoin: 72,
        stellar: 0.11,
        dogecoin: 0.08,
        cosmos: 9.5,
        tron: 0.12
    };

    const imageMap = {
        bitcoin: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        ethereum: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        binancecoin: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
        solana: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        ripple: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
        cardano: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
        avalanche: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
        polkadot: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
        chainlink: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
        'matic-network': 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
        polygon: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
        litecoin: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
        stellar: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
        dogecoin: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
        cosmos: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
        tron: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png'
    };

    const nameMap = {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum',
        binancecoin: 'Binance Coin',
        solana: 'Solana',
        ripple: 'XRP',
        cardano: 'Cardano',
        avalanche: 'Avalanche',
        polkadot: 'Polkadot',
        chainlink: 'Chainlink',
        'matic-network': 'Polygon',
        polygon: 'Polygon',
        litecoin: 'Litecoin',
        stellar: 'Stellar',
        dogecoin: 'Dogecoin',
        cosmos: 'Cosmos',
        tron: 'TRON'
    };

    let intervalId = setInterval(() => {
        const updates = selectedCryptos.map(id => {
            const base = basePrices[id] || 100;
            const fluctuation = (Math.random() - 0.5) * 0.04;
            const price = base * (1 + fluctuation);
            const change = (Math.random() - 0.5) * 8;

            return {
                id,
                symbol: id === 'ripple' ? 'XRP' : id.substring(0, 3).toUpperCase(),
                name: nameMap[id] || id.charAt(0).toUpperCase() + id.slice(1),
                current_price: price,
                price_change_percentage_24h: change,
                market_cap: price * 1000000,
                image: imageMap[id]
            };
        });

        onUpdate(updates);
    }, 5000);

    return {
        close: () => clearInterval(intervalId),
        status: 'connected'
    };
}

function getCurrencyFlag(currency) {
    const flags = {
        eur: '🇪🇺', gbp: '🇬🇧', jpy: '🇯🇵', brl: '🇧🇷',
        cad: '🇨🇦', aud: '🇦🇺', chf: '🇨🇭', cny: '🇨🇳',
        inr: '🇮🇳', mxn: '🇲🇽', krw: '🇰🇷', ars: '🇦🇷'
    };
    return flags[currency] || '💱';
}

function getCommodityName(symbol) {
    const names = {
        XAU: 'Gold', XAG: 'Silver', WTI: 'Crude Oil', NG: 'Natural Gas',
        HG: 'Copper', XPT: 'Platinum', XPD: 'Palladium',
        ZC: 'Corn', ZW: 'Wheat', KC: 'Coffee'
    };
    return names[symbol] || symbol;
}

function getCommodityUnit(symbol) {
    const units = {
        XAU: 'oz', XAG: 'oz', WTI: 'bbl', NG: 'MMBtu',
        HG: 'lb', XPT: 'oz', XPD: 'oz',
        ZC: 'bu', ZW: 'bu', KC: 'lb'
    };
    return units[symbol] || 'unit';
}

function getCommodityIcon(symbol) {
    const icons = {
        XAU: '🥇', XAG: '🥈', WTI: '🛢️', NG: '🔥',
        HG: '🔶', XPT: '⚪', XPD: '⚫',
        ZC: '🌽', ZW: '🌾', KC: '☕'
    };
    return icons[symbol] || '📊';
}

export default wsManager;
