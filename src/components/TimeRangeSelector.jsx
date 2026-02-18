import React from 'react';
import './TimeRangeSelector.css';

const TIME_RANGES = [
    { value: '1D', label: '1D' },
    { value: '7D', label: '7D' },
    { value: '30D', label: '30D' },
    { value: '1Y', label: '1Y' },
    { value: 'ALL', label: 'ALL' }
];

const TimeRangeSelector = ({ selectedRange, onRangeChange }) => {
    return (
        <div className="time-range-selector">
            {TIME_RANGES.map(({ value, label }) => (
                <button
                    key={value}
                    className={`range-button ${selectedRange === value ? 'active' : ''}`}
                    onClick={() => onRangeChange(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default TimeRangeSelector;
