import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { AVAILABLE_CURRENCIES } from '../services/currencyService';
import { AVAILABLE_CRYPTOS } from '../services/cryptoService';
import { AVAILABLE_COMMODITIES } from '../services/commodityService';

const SettingsModal = ({ isOpen, onClose, preferences, onSave }) => {
    const [localPreferences, setLocalPreferences] = useState(preferences);
    const { theme, toggleTheme, isDark } = useTheme();
    const { t, i18n } = useTranslation();

    const currentLanguage = i18n.language;

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    if (!isOpen) return null;

    const handleToggle = (category, id) => {
        setLocalPreferences(prev => ({
            ...prev,
            [category]: prev[category].includes(id)
                ? prev[category].filter(item => item !== id)
                : [...prev[category], id]
        }));
    };

    const handleSelectAll = (category, items) => {
        setLocalPreferences(prev => ({
            ...prev,
            [category]: items
        }));
    };

    const handleDeselectAll = (category) => {
        setLocalPreferences(prev => ({
            ...prev,
            [category]: []
        }));
    };

    const handleSave = () => {
        onSave(localPreferences);
        onClose();
    };

    const handleCancel = () => {
        setLocalPreferences(preferences);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">⚙️ {t('settings.title')}</h2>
                    <button className="modal-close" onClick={handleCancel}>✕</button>
                </div>

                <div className="modal-body">
                    <section className="settings-section theme-section">
                        <div className="section-header-settings">
                            <h3>🌍 {t('settings.language')}</h3>
                        </div>
                        <div className="theme-toggle-container">
                            <button
                                className={`theme-toggle-btn ${currentLanguage === 'pt-BR' ? 'active' : ''}`}
                                onClick={() => changeLanguage('pt-BR')}
                            >
                                <span className="theme-icon">🇧🇷</span>
                                <span className="theme-label">{t('settings.portuguese')}</span>
                            </button>
                            <button
                                className={`theme-toggle-btn ${currentLanguage === 'en-US' ? 'active' : ''}`}
                                onClick={() => changeLanguage('en-US')}
                            >
                                <span className="theme-icon">🇺🇸</span>
                                <span className="theme-label">{t('settings.english')}</span>
                            </button>
                        </div>
                    </section>

                    <section className="settings-section theme-section">
                        <div className="section-header-settings">
                            <h3>🎨 {t('settings.theme')}</h3>
                        </div>
                        <div className="theme-toggle-container">
                            <button
                                className={`theme-toggle-btn ${isDark ? 'active' : ''}`}
                                onClick={toggleTheme}
                            >
                                <span className="theme-icon">🌙</span>
                                <span className="theme-label">{t('settings.dark')}</span>
                            </button>
                            <button
                                className={`theme-toggle-btn ${!isDark ? 'active' : ''}`}
                                onClick={toggleTheme}
                            >
                                <span className="theme-icon">☀️</span>
                                <span className="theme-label">{t('settings.light')}</span>
                            </button>
                        </div>
                    </section>

                    <section className="settings-section">
                        <div className="section-header-settings">
                            <h3>💱 {t('sections.currencies')}</h3>
                            <div className="section-actions">
                                <button
                                    className="btn-select"
                                    onClick={() => handleSelectAll('currencies', AVAILABLE_CURRENCIES.map(c => c.target))}
                                >
                                    {t('buttons.selectAll')}
                                </button>
                                <button
                                    className="btn-select"
                                    onClick={() => handleDeselectAll('currencies')}
                                >
                                    {t('buttons.clear')}
                                </button>
                            </div>
                        </div>
                        <div className="options-grid">
                            {AVAILABLE_CURRENCIES.map(currency => (
                                <label key={currency.target} className="option-item">
                                    <input
                                        type="checkbox"
                                        checked={localPreferences.currencies.includes(currency.target)}
                                        onChange={() => handleToggle('currencies', currency.target)}
                                    />
                                    <span className="option-label">
                                        <span className="option-icon">{currency.flag}</span>
                                        <span className="option-name">{currency.name}</span>
                                        <span className="option-pair">{currency.pair}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="settings-section">
                        <div className="section-header-settings">
                            <h3>₿ {t('sections.cryptos')}</h3>
                            <div className="section-actions">
                                <button
                                    className="btn-select"
                                    onClick={() => handleSelectAll('cryptos', AVAILABLE_CRYPTOS.map(c => c.id))}
                                >
                                    {t('buttons.selectAll')}
                                </button>
                                <button
                                    className="btn-select"
                                    onClick={() => handleDeselectAll('cryptos')}
                                >
                                    {t('buttons.clear')}
                                </button>
                            </div>
                        </div>
                        <div className="options-grid">
                            {AVAILABLE_CRYPTOS.map(crypto => (
                                <label key={crypto.id} className="option-item">
                                    <input
                                        type="checkbox"
                                        checked={localPreferences.cryptos.includes(crypto.id)}
                                        onChange={() => handleToggle('cryptos', crypto.id)}
                                    />
                                    <span className="option-label">
                                        <span className="option-icon">{crypto.icon}</span>
                                        <span className="option-name">{crypto.name}</span>
                                        <span className="option-pair">{crypto.symbol}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="settings-section">
                        <div className="section-header-settings">
                            <h3>🥇 {t('sections.commodities')}</h3>
                            <div className="section-actions">
                                <button
                                    className="btn-select"
                                    onClick={() => handleSelectAll('commodities', AVAILABLE_COMMODITIES.map(c => c.symbol))}
                                >
                                    {t('buttons.selectAll')}
                                </button>
                                <button
                                    className="btn-select"
                                    onClick={() => handleDeselectAll('commodities')}
                                >
                                    {t('buttons.clear')}
                                </button>
                            </div>
                        </div>
                        <div className="options-grid">
                            {AVAILABLE_COMMODITIES.map(commodity => (
                                <label key={commodity.symbol} className="option-item">
                                    <input
                                        type="checkbox"
                                        checked={localPreferences.commodities.includes(commodity.symbol)}
                                        onChange={() => handleToggle('commodities', commodity.symbol)}
                                    />
                                    <span className="option-label">
                                        <span className="option-icon">{commodity.icon}</span>
                                        <span className="option-name">{commodity.name}</span>
                                        <span className="option-pair">{commodity.symbol}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={handleCancel}>
                        {t('buttons.cancel')}
                    </button>
                    <button className="btn-save" onClick={handleSave}>
                        💾 {t('buttons.save')} Preferências
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
