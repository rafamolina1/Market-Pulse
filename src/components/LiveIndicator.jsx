import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../utils/formatters';

const LiveIndicator = React.memo(({ lastUpdate, isRealTime = false }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="live-indicator">
            <div className="live-dot"></div>
            <span>{isRealTime ? t('indicators.realtime') : t('indicators.live')}</span>
            {lastUpdate && (
                <span className="last-update">
                    {formatDateTime(lastUpdate, i18n.language)}
                </span>
            )}
        </div>
    );
});

export default LiveIndicator;
