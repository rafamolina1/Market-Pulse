import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import './index.css';

import ErrorBoundary from './components/ErrorBoundary';

import { MarketProvider } from './contexts/MarketContext';
import { PortfolioProvider } from './contexts/PortfolioContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <ErrorBoundary>
                <MarketProvider>
                    <PortfolioProvider>
                        <App />
                    </PortfolioProvider>
                </MarketProvider>
            </ErrorBoundary>
        </ThemeProvider>
    </React.StrictMode>,
);
