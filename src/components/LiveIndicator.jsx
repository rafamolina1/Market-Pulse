import React from 'react';
import { formatDate } from '../utils/formatters';

const LiveIndicator = React.memo(({ lastUpdate, isRealTime = false }) => {
    return (
        <div className="live-indicator">
            <div className="live-dot"></div>
            <span>{isRealTime ? 'REAL-TIME' : 'LIVE'}</span>
            {lastUpdate && (
                <span className="last-update">
                    {formatDate(lastUpdate)}
                </span>
            )}
        </div>
    );
});

export default LiveIndicator;
