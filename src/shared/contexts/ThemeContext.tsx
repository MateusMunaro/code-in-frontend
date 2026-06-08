import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeColors, ThemeName, themes } from '@/styles/colors';
import { ThemeTypography, typography } from '@/styles/typography';

// ===== Context Type =====

interface ThemeContextType {
    theme: ThemeName;
    colors: ThemeColors;
    typography: ThemeTypography;
    setTheme: (theme: ThemeName) => void;
    toggleTheme: () => void;
}

// ===== Context =====

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ===== CSS Variable Mapping =====

// Converts hex or rgb/rgba string to "r g b" (space-separated) for css rgb(r g b / alpha)
function toRgbComponents(color: string): string {
    const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (hex) return `${parseInt(hex[1], 16)} ${parseInt(hex[2], 16)} ${parseInt(hex[3], 16)}`;
    const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgb) return `${rgb[1]} ${rgb[2]} ${rgb[3]}`;
    return '0 0 0';
}

function applyThemeCSSVariables(colors: ThemeColors) {
    const root = document.documentElement;

    // Background
    root.style.setProperty('--color-bg-content', colors.background.content);
    root.style.setProperty('--color-bg-surface', colors.background.surface);
    root.style.setProperty('--color-bg-elevated', colors.background.elevated);
    root.style.setProperty('--color-bg-content-rgb', toRgbComponents(colors.background.content));
    root.style.setProperty('--color-bg-surface-rgb', toRgbComponents(colors.background.surface));
    root.style.setProperty('--color-bg-elevated-rgb', toRgbComponents(colors.background.elevated));

    // Text
    root.style.setProperty('--color-text-primary', colors.text.primary);
    root.style.setProperty('--color-text-secondary', colors.text.secondary);
    root.style.setProperty('--color-text-muted', colors.text.muted);
    root.style.setProperty('--color-text-primary-rgb', toRgbComponents(colors.text.primary));
    root.style.setProperty('--color-text-secondary-rgb', toRgbComponents(colors.text.secondary));
    root.style.setProperty('--color-text-muted-rgb', toRgbComponents(colors.text.muted));

    // Brand
    root.style.setProperty('--color-brand-primary', colors.brand.primary);
    root.style.setProperty('--color-brand-primaryHover', colors.brand.primaryHover);
    root.style.setProperty('--color-brand-secondary', colors.brand.secondary);
    root.style.setProperty('--color-brand-secondaryHover', colors.brand.secondaryHover);
    root.style.setProperty('--color-brand-accent', colors.brand.accent);
    root.style.setProperty('--color-brand-primary-rgb', toRgbComponents(colors.brand.primary));
    root.style.setProperty('--color-brand-primaryHover-rgb', toRgbComponents(colors.brand.primaryHover));
    root.style.setProperty('--color-brand-secondary-rgb', toRgbComponents(colors.brand.secondary));
    root.style.setProperty('--color-brand-secondaryHover-rgb', toRgbComponents(colors.brand.secondaryHover));
    root.style.setProperty('--color-brand-accent-rgb', toRgbComponents(colors.brand.accent));

    // Border
    root.style.setProperty('--color-border-default', colors.border.default);
    root.style.setProperty('--color-border-subtle', colors.border.subtle);
    root.style.setProperty('--color-border-emphasis', colors.border.emphasis);

    // Status
    root.style.setProperty('--color-status-success', colors.status.success);
    root.style.setProperty('--color-status-error', colors.status.error);
    root.style.setProperty('--color-status-warning', colors.status.warning);
    root.style.setProperty('--color-status-info', colors.status.info);
    root.style.setProperty('--color-status-success-rgb', toRgbComponents(colors.status.success));
    root.style.setProperty('--color-status-error-rgb', toRgbComponents(colors.status.error));
    root.style.setProperty('--color-status-warning-rgb', toRgbComponents(colors.status.warning));
    root.style.setProperty('--color-status-info-rgb', toRgbComponents(colors.status.info));

    // Glow
    root.style.setProperty('--color-glow-primary', colors.glow.primary);
    root.style.setProperty('--color-glow-primary-lg', colors.glow.primaryLg);
    root.style.setProperty('--color-glow-secondary', colors.glow.secondary);
}

function applyTypographyCSSVariables(typo: ThemeTypography) {
    const root = document.documentElement;

    // Font families
    root.style.setProperty('--font-display', typo.fontFamily.display);
    root.style.setProperty('--font-body', typo.fontFamily.body);

    // Font sizes
    root.style.setProperty('--font-size-h1', typo.fontSize.h1);
    root.style.setProperty('--font-size-h2', typo.fontSize.h2);
    root.style.setProperty('--font-size-h3', typo.fontSize.h3);
    root.style.setProperty('--font-size-body', typo.fontSize.body);
    root.style.setProperty('--font-size-caption', typo.fontSize.caption);
    root.style.setProperty('--font-size-small', typo.fontSize.small);

    // Letter spacing
    root.style.setProperty('--letter-spacing-normal', typo.letterSpacing.normal);
    root.style.setProperty('--letter-spacing-wide', typo.letterSpacing.wide);
    root.style.setProperty('--letter-spacing-widest', typo.letterSpacing.widest);
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
        applyTypographyCSSVariables(typography);
        document.documentElement.setAttribute('data-theme', theme);
    }, [colors, theme]);

    const value = useMemo(
        () => ({ theme, colors, typography, setTheme, toggleTheme }),
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
