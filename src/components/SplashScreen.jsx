import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFade(true);
        }, 1200);

        const finishTimer = setTimeout(() => {
            onFinish();
        }, 1550);

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div className={`splash-screen ${fade ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <div className="splash-logo-shell">
                    <img src="/pwa-192x192.png" alt="MarketPulse Logo" className="splash-logo" />
                </div>
                <h1 className="splash-title">Market<span className="splash-highlight">Pulse</span></h1>
                <p className="splash-subtitle">Precision dashboard for currencies, crypto and commodities.</p>
            </div>
        </div>
    );
};

export default SplashScreen;
