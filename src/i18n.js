import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';

const getStoredLanguage = () => {
    if (typeof window === 'undefined') return 'pt-BR';
    return localStorage.getItem('marketpulse-language') || 'pt-BR';
};

const storedLanguage = getStoredLanguage();

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

i18n.on('languageChanged', (lng) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('marketpulse-language', lng);
        document.documentElement.lang = lng;
    }
});

if (typeof document !== 'undefined') {
    document.documentElement.lang = storedLanguage;
}

export default i18n;
