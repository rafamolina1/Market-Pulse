import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';

// Get stored language or default to Portuguese
const storedLanguage = localStorage.getItem('marketpulse-language') || 'pt-BR';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            'pt-BR': {
                translation: ptBR
            },
            'en-US': {
                translation: enUS
            }
        },
        lng: storedLanguage,
        fallbackLng: 'pt-BR',
        interpolation: {
            escapeValue: false // React already escapes values
        }
    });

// Save language to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('marketpulse-language', lng);
});

export default i18n;
