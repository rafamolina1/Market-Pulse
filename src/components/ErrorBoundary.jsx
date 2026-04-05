import React from 'react';
import i18n from '../i18n';
import './ErrorBoundary.css';

const STORAGE_PREFIXES = ['marketpulse-', 'marketpulse_'];
const isDevelopment = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        Object.keys(localStorage)
            .filter((key) => STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix)))
            .forEach((key) => localStorage.removeItem(key));
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-container">
                    <div className="error-card glass-card">
                        <div className="error-icon">⚠️</div>
                        <h2>{i18n.t('errorBoundary.title')}</h2>
                        <p>{i18n.t('errorBoundary.description')}</p>

                        {isDevelopment && (
                            <div className="error-details">
                                <details>
                                    <summary>{i18n.t('errorBoundary.details')}</summary>
                                    <p>{this.state.error && this.state.error.toString()}</p>
                                    <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
                                </details>
                            </div>
                        )}

                        <div className="error-actions">
                            <button className="btn-reload" onClick={this.handleReload}>
                                🔄 {i18n.t('errorBoundary.reload')}
                            </button>
                            <button
                                className="btn-reset"
                                onClick={this.handleReset}
                                title={i18n.t('errorBoundary.resetTitle')}
                            >
                                🗑️ {i18n.t('errorBoundary.reset')}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
