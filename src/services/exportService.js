import i18n from '../i18n';
import { calculateAssetPL } from './portfolioService';

const formatterCache = new Map();

const getFormatter = (currency) => {
    const locale = currency === 'BRL' ? 'pt-BR' : 'en-US';
    const key = `${locale}:${currency}`;

    if (!formatterCache.has(key)) {
        formatterCache.set(key, new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }));
    }

    return formatterCache.get(key);
};

const formatCurrency = (value, currency) => {
    return getFormatter(currency).format(value);
};

const getCurrentPriceForAsset = (holding, currentPrices) => {
    const { currencies = [], cryptos = [], commodities = [] } = currentPrices;

    switch (holding.type) {
        case 'currency':
            const currency = currencies.find(c =>
                c.target === holding.assetId ||
                (c.target && holding.assetId && c.target.toLowerCase() === holding.assetId.toLowerCase())
            );
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

export const exportToCSV = (portfolio, currentPrices, displayCurrency = 'USD', brlRate = 1) => {
    const headers = ['Type', 'Name', 'Symbol', 'Quantity', 'Purchase Price', 'Current Price', 'Total Value', 'Profit/Loss', 'P&L %'];

    const rows = portfolio.holdings.map(holding => {
        const currentPrice = getCurrentPriceForAsset(holding, currentPrices);
        const pl = calculateAssetPL(holding, currentPrice);

        const rate = displayCurrency === 'BRL' ? brlRate : 1;
        const purchasePrice = holding.purchasePrice * rate;
        const currentPriceVal = (currentPrice || 0) * rate;
        const totalValue = pl.currentValue * rate;
        const profit = pl.profit * rate;

        return [
            holding.type.toUpperCase(),
            holding.name,
            holding.symbol,
            holding.quantity,
            formatCurrency(purchasePrice, displayCurrency),
            formatCurrency(currentPriceVal, displayCurrency),
            formatCurrency(totalValue, displayCurrency),
            formatCurrency(profit, displayCurrency),
            pl.profitPercent.toFixed(2) + '%'
        ];
    });

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
        ok: true,
        message: i18n.t('portfolio.exportCsvSuccess')
    };
};

export const exportToPDF = async (portfolio, currentPrices, displayCurrency = 'USD', brlRate = 1) => {
    try {
        const { jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();
        const now = new Date();

        doc.setFontSize(20);
        doc.text('MarketPulse Portfolio Report', 14, 22);

        doc.setFontSize(11);
        doc.text(`Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 14, 30);
        doc.text(`Currency: ${displayCurrency}`, 14, 36);

        const headers = [['Type', 'Asset', 'Qty', 'Buy Price', 'Cur. Price', 'Value', 'P&L', 'P&L %']];

        let totalValue = 0;
        let totalProfit = 0;
        let totalInvested = 0;

        const data = portfolio.holdings.map(holding => {
            const currentPrice = getCurrentPriceForAsset(holding, currentPrices);
            const pl = calculateAssetPL(holding, currentPrice);

            const rate = displayCurrency === 'BRL' ? brlRate : 1;
            const purchasePrice = holding.purchasePrice * rate;
            const currentPriceVal = (currentPrice || 0) * rate;
            const currentValue = pl.currentValue * rate;
            const profit = pl.profit * rate;
            const invested = pl.purchaseValue * rate;

            totalValue += currentValue;
            totalProfit += profit;
            totalInvested += invested;

            return [
                holding.type.toUpperCase(),
                `${holding.name} (${holding.symbol})`,
                holding.quantity,
                formatCurrency(purchasePrice, displayCurrency),
                formatCurrency(currentPriceVal, displayCurrency),
                formatCurrency(currentValue, displayCurrency),
                formatCurrency(profit, displayCurrency),
                pl.profitPercent.toFixed(2) + '%'
            ];
        });

        autoTable(doc, {
            head: headers,
            body: data,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [255, 127, 62] }, // Tron Orange
            styles: { fontSize: 8 },
            foot: [[
                'TOTAL', '', '', '', '',
                formatCurrency(totalValue, displayCurrency),
                formatCurrency(totalProfit, displayCurrency),
                ((totalProfit / totalInvested) * 100).toFixed(2) + '%'
            ]],
            footStyles: { fillColor: [41, 41, 41], textColor: [255, 255, 255], fontStyle: 'bold' }
        });

        doc.save(`portfolio_report_${new Date().toISOString().split('T')[0]}.pdf`);
        return {
            ok: true,
            message: i18n.t('portfolio.exportPdfSuccess')
        };
    } catch (error) {
        console.error('Error generating PDF:', error);
        return {
            ok: false,
            message: i18n.t('portfolio.exportError')
        };
    }
};
