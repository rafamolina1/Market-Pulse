import React from 'react';
import './ErrorBoundary.css';

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
        localStorage.clear();
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-container">
                    <div className="error-card glass-card">
                        <div className="error-icon">⚠️</div>
                        <h2>Oops! Something went wrong.</h2>
                        <p>We're sorry, but the application encountered an unexpected error.</p>

                        <div className="error-details">
                            <details>
                                <summary>Error Details</summary>
                                <p>{this.state.error && this.state.error.toString()}</p>
                                <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
                            </details>
                        </div>

                        <div className="error-actions">
                            <button className="btn-reload" onClick={this.handleReload}>
                                🔄 Reload Page
                            </button>
                            <button className="btn-reset" onClick={this.handleReset} title="Clear data and reload">
                                🗑️ Hard Reset
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
