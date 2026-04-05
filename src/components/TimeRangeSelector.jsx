import React from 'react';
import { useTranslation } from 'react-i18next';
import './TimeRangeSelector.css';

const TIME_RANGES = [
    { value: '1D', label: '1D' },
    { value: '7D', label: '7D' },
    { value: '30D', label: '30D' },
    { value: '1Y', label: '1Y' },
    { value: 'ALL', label: 'ALL' }
];

const TimeRangeSelector = ({ selectedRange, onRangeChange }) => {
    const { t } = useTranslation();

    return (
        <div className="time-range-selector" role="tablist" aria-label={t('chart.rangeSelector')}>
            {TIME_RANGES.map(({ value, label }) => (
                <button
                    key={value}
                    className={`range-button ${selectedRange === value ? 'active' : ''}`}
                    onClick={() => onRangeChange(value)}
                    role="tab"
                    aria-selected={selectedRange === value}
                    aria-label={t(`chart.periods.${value}`)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default TimeRangeSelector;
