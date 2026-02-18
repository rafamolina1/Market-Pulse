const BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';

export const AVAILABLE_CURRENCIES = [
    { pair: 'USD/EUR', base: 'usd', target: 'eur', name: 'Euro', flag: '🇪🇺' },
    { pair: 'USD/GBP', base: 'usd', target: 'gbp', name: 'British Pound', flag: '🇬🇧' },
    { pair: 'USD/JPY', base: 'usd', target: 'jpy', name: 'Japanese Yen', flag: '🇯🇵' },
    { pair: 'USD/BRL', base: 'usd', target: 'brl', name: 'Brazilian Real', flag: '🇧🇷' },
    { pair: 'USD/CAD', base: 'usd', target: 'cad', name: 'Canadian Dollar', flag: '🇨🇦' },
    { pair: 'USD/AUD', base: 'usd', target: 'aud', name: 'Australian Dollar', flag: '🇦🇺' },
    { pair: 'USD/CHF', base: 'usd', target: 'chf', name: 'Swiss Franc', flag: '🇨🇭' },
    { pair: 'USD/CNY', base: 'usd', target: 'cny', name: 'Chinese Yuan', flag: '🇨🇳' },
    { pair: 'USD/INR', base: 'usd', target: 'inr', name: 'Indian Rupee', flag: '🇮🇳' },
    { pair: 'USD/MXN', base: 'usd', target: 'mxn', name: 'Mexican Peso', flag: '🇲🇽' },
    { pair: 'USD/KRW', base: 'usd', target: 'krw', name: 'South Korean Won', flag: '🇰🇷' },
    { pair: 'USD/ARS', base: 'usd', target: 'ars', name: 'Argentine Peso', flag: '🇦🇷' },
];

const generateMockData = (target) => {
    const rates = {
        eur: 0.92, gbp: 0.79, jpy: 149.85, brl: 4.98,
        cad: 1.35, aud: 1.52, chf: 0.88, cny: 7.24,
        inr: 83.12, mxn: 17.08, krw: 1328.45, ars: 850.75
    };
    return {
        rate: rates[target] || 1,
        change: (Math.random() - 0.5) * 2,
    };
};

export const fetchCurrencyRates = async (selectedPairs = ['eur', 'gbp', 'jpy', 'brl']) => {
    try {
        const response = await fetch(`${BASE_URL}/currencies/usd.json`);
        const data = await response.json();

        return selectedPairs.map(target => {
            const currencyData = AVAILABLE_CURRENCIES.find(c => c.target === target);
            return {
                target,
                pair: currencyData?.pair || `USD/${target.toUpperCase()}`,
                rate: data.usd[target] || generateMockData(target).rate,
                change: (Math.random() - 0.5) * 2,
                flag: currencyData?.flag || '🌐',
            };
        });
    } catch (error) {
        console.warn('Failed to fetch currency rates, using mock data:', error);
        return selectedPairs.map(target => {
            const currencyData = AVAILABLE_CURRENCIES.find(c => c.target === target);
            const mock = generateMockData(target);
            return {
                target,
                pair: currencyData?.pair || `USD/${target.toUpperCase()}`,
                ...mock,
                flag: currencyData?.flag || '🌐',
            };
        });
    }
};

export const getCurrencyPairData = async (base, target) => {
    try {
        const response = await fetch(`${BASE_URL}/currencies/${base.toLowerCase()}.json`);
        const data = await response.json();
        const rate = data[base.toLowerCase()][target.toLowerCase()];

        return {
            pair: `${base.toUpperCase()}/${target.toUpperCase()}`,
            rate: rate,
            change: (Math.random() - 0.5) * 2,
        };
    } catch (error) {
        console.error('Error fetching currency pair:', error);
        return {
            pair: `${base}/${target}`,
            rate: 1,
            change: 0,
        };
    }
};
