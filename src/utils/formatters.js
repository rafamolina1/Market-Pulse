const numberFormatterCache = new Map();
const dateTimeFormatterCache = new Map();
const dateFormatterCache = new Map();

const getFormatterKey = (locale, options) => `${locale}:${JSON.stringify(options)}`;

const getNumberFormatter = (locale, options) => {
    const key = getFormatterKey(locale, options);

    if (!numberFormatterCache.has(key)) {
        numberFormatterCache.set(key, new Intl.NumberFormat(locale, options));
    }

    return numberFormatterCache.get(key);
};

const getDateTimeFormatter = (locale, options) => {
    const key = getFormatterKey(locale, options);

    if (!dateTimeFormatterCache.has(key)) {
        dateTimeFormatterCache.set(key, new Intl.DateTimeFormat(locale, options));
    }

    return dateTimeFormatterCache.get(key);
};

const getDateFormatter = (locale, options) => {
    const key = getFormatterKey(locale, options);

    if (!dateFormatterCache.has(key)) {
        dateFormatterCache.set(key, new Intl.DateTimeFormat(locale, options));
    }

    return dateFormatterCache.get(key);
};

export const formatCurrency = (value, currency = 'USD', decimals = 2, locale = 'en-US') => {
    return getNumberFormatter(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};

export const formatNumber = (value, decimals = 2, locale = 'en-US') => {
    return getNumberFormatter(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};

export const formatPercentage = (value, decimals = 2) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
};

export const formatCompactNumber = (value) => {
    if (value >= 1e12) {
        return `$${(value / 1e12).toFixed(2)}T`;
    }
    if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
    }
    if (value >= 1e3) {
        return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
};

export const formatDateTime = (date, locale = 'pt-BR') => {
    return getDateTimeFormatter(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
};

export const formatDate = (date, locale = 'pt-BR') => {
    return getDateFormatter(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};
