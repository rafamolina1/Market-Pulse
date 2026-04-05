import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'dark';
        const savedTheme = localStorage.getItem('marketpulse-theme');
        return savedTheme || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('marketpulse-theme', theme);

        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#09111f' : '#f6f2eb');
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    }, []);

    const setThemeMode = useCallback((nextTheme) => {
        setTheme(nextTheme);
    }, []);

    const value = useMemo(() => ({
        theme,
        toggleTheme,
        setThemeMode,
        isDark: theme === 'dark',
        isLight: theme === 'light'
    }), [theme, toggleTheme, setThemeMode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
