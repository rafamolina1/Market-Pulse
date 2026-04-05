import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    addAsset,
    calculateAssetPL,
    calculatePortfolioValue,
    getPortfolio,
    removeAsset,
    savePortfolio,
    updateAsset
} from './portfolioService';

const createStorageMock = () => {
    let store = {};

    return {
        getItem: vi.fn((key) => (key in store ? store[key] : null)),
        setItem: vi.fn((key, value) => {
            store[key] = String(value);
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        })
    };
};

describe('portfolioService', () => {
    beforeEach(() => {
        Object.defineProperty(globalThis, 'localStorage', {
            value: createStorageMock(),
            configurable: true
        });
    });

    it('returns an empty portfolio when storage is empty', () => {
        expect(getPortfolio()).toEqual({ holdings: [] });
    });

    it('saves and restores portfolio data', () => {
        const portfolio = {
            holdings: [
                { id: 'crypto-bitcoin-1', type: 'crypto', assetId: 'bitcoin', quantity: 2, purchasePrice: 100 }
            ]
        };

        expect(savePortfolio(portfolio)).toBe(true);
        expect(getPortfolio()).toEqual(portfolio);
    });

    it('adds, updates and removes assets while persisting the changes', () => {
        const basePortfolio = { holdings: [] };
        const added = addAsset(basePortfolio, {
            type: 'crypto',
            assetId: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            quantity: 1,
            purchasePrice: 45000
        });

        expect(added.holdings).toHaveLength(1);
        expect(added.holdings[0]).toMatchObject({
            type: 'crypto',
            assetId: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            quantity: 1,
            purchasePrice: 45000
        });

        const updated = updateAsset(added, added.holdings[0].id, { quantity: 2 });
        expect(updated.holdings[0].quantity).toBe(2);

        const removed = removeAsset(updated, updated.holdings[0].id);
        expect(removed.holdings).toEqual([]);
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('calculates profit and loss for crypto and commodities using multiplication', () => {
        const result = calculateAssetPL(
            { type: 'crypto', quantity: 2, purchasePrice: 100 },
            120
        );

        expect(result).toEqual({
            currentValue: 240,
            purchaseValue: 200,
            profit: 40,
            profitPercent: 20
        });
    });

    it('calculates currency positions using inverse price logic consistently', () => {
        const result = calculateAssetPL(
            { type: 'currency', quantity: 1000, purchasePrice: 5 },
            4
        );

        expect(result.currentValue).toBe(250);
        expect(result.purchaseValue).toBe(200);
        expect(result.profit).toBe(50);
        expect(result.profitPercent).toBe(25);
    });

    it('aggregates total portfolio values across asset classes', () => {
        const portfolio = {
            holdings: [
                {
                    id: 'currency-brl-1',
                    type: 'currency',
                    assetId: 'brl',
                    quantity: 1000,
                    purchasePrice: 5
                },
                {
                    id: 'crypto-btc-1',
                    type: 'crypto',
                    assetId: 'bitcoin',
                    quantity: 2,
                    purchasePrice: 100
                }
            ]
        };

        const currentPrices = {
            currencies: [{ target: 'brl', rate: 4 }],
            cryptos: [{ id: 'bitcoin', current_price: 120 }],
            commodities: []
        };

        expect(calculatePortfolioValue(portfolio, currentPrices)).toEqual({
            totalCurrentValue: 490,
            totalPurchaseValue: 400,
            totalProfit: 90,
            totalProfitPercent: 22.5
        });
    });

    it('returns zeroed values when a position has missing price data', () => {
        expect(
            calculateAssetPL({ type: 'commodity', quantity: 2, purchasePrice: 100 }, null)
        ).toEqual({
            profit: 0,
            profitPercent: 0,
            currentValue: 0,
            purchaseValue: 0
        });
    });
});
