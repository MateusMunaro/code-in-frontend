import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeColors, ThemeName, themes } from '@/styles/colors';

// ===== Context Type =====

interface ThemeContextType {
    theme: ThemeName;
    colors: ThemeColors;
    setTheme: (theme: ThemeName) => void;
    toggleTheme: () => void;
}

// ===== Context =====

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ===== CSS Variable Mapping =====

function applyThemeCSSVariables(colors: ThemeColors) {
    const root = document.documentElement;

    // Background
    root.style.setProperty('--color-bg-content', colors.background.content);
    root.style.setProperty('--color-bg-surface', colors.background.surface);
    root.style.setProperty('--color-bg-elevated', colors.background.elevated);

    // Text
    root.style.setProperty('--color-text-primary', colors.text.primary);
    root.style.setProperty('--color-text-secondary', colors.text.secondary);
    root.style.setProperty('--color-text-muted', colors.text.muted);

    // Brand
    root.style.setProperty('--color-brand-primary', colors.brand.primary);
    root.style.setProperty('--color-brand-primaryHover', colors.brand.primaryHover);
    root.style.setProperty('--color-brand-secondary', colors.brand.secondary);
    root.style.setProperty('--color-brand-secondaryHover', colors.brand.secondaryHover);
    root.style.setProperty('--color-brand-accent', colors.brand.accent);

    // Border
    root.style.setProperty('--color-border-default', colors.border.default);
    root.style.setProperty('--color-border-subtle', colors.border.subtle);
    root.style.setProperty('--color-border-emphasis', colors.border.emphasis);

    // Status
    root.style.setProperty('--color-status-success', colors.status.success);
    root.style.setProperty('--color-status-error', colors.status.error);
    root.style.setProperty('--color-status-warning', colors.status.warning);
    root.style.setProperty('--color-status-info', colors.status.info);

    // Glow
    root.style.setProperty('--color-glow-primary', colors.glow.primary);
    root.style.setProperty('--color-glow-primary-lg', colors.glow.primaryLg);
    root.style.setProperty('--color-glow-secondary', colors.glow.secondary);
}

// ===== Provider =====

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'dark',
}) => {
    const [theme, setThemeState] = useState<ThemeName>(() => {
        const saved = localStorage.getItem('code-in-theme');
        return (saved as ThemeName) || defaultTheme;
    });

    const colors = useMemo(() => themes[theme], [theme]);

    const setTheme = useCallback((newTheme: ThemeName) => {
        setThemeState(newTheme);
        localStorage.setItem('code-in-theme', newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    // Apply CSS variables whenever theme changes
    useEffect(() => {
        applyThemeCSSVariables(colors);
        document.documentElement.setAttribute('data-theme', theme);
    }, [colors, theme]);

    const value = useMemo(
        () => ({ theme, colors, setTheme, toggleTheme }),
        [theme, colors, setTheme, toggleTheme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// ===== Hook =====

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export { ThemeContext };
