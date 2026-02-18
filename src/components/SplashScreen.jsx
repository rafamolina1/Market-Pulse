import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFade(true);
        }, 2000);

        const finishTimer = setTimeout(() => {
            onFinish();
        }, 2500);

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div className={`splash-screen ${fade ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <img src="/pwa-192x192.png" alt="MarketPulse Logo" className="splash-logo" />
                <h1 className="splash-title">Market<span className="splash-highlight">Pulse</span></h1>
                <p className="splash-subtitle">Your Assets. Real Time.</p>
            </div>
        </div>
    );
};

export default SplashScreen;
