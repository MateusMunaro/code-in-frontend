// ===== Theme Color Types =====

export interface ThemeColors {
    background: {
        content: string;
        surface: string;
        elevated: string;
    };
    text: {
        primary: string;
        secondary: string;
        muted: string;
    };
    brand: {
        primary: string;
        primaryHover: string;
        secondary: string;
        secondaryHover: string;
        accent: string;
    };
    border: {
        default: string;
        subtle: string;
        emphasis: string;
    };
    status: {
        success: string;
        error: string;
        warning: string;
        info: string;
    };
    glow: {
        primary: string;
        primaryLg: string;
        secondary: string;
    };
}

// ===== Deep Focus Palette =====
//
// Deep Void Blue:       #0A1929  — Base sólida, profundidade
// Onyx Canvas:          #0F172A  — Background dark mode
// Technical Slate:      #94A3B8  — Texto secundário, metálico
// Electric Cyan:        #00B4D8  — Acento, cursor ativo
// ================================

// ===== Theme Definitions =====

export const dark: ThemeColors = {
    background: {
        content: '#0F172A',   // Onyx Canvas — fundo geral
        surface: '#0A1929',   // Deep Void Blue — superfícies
        elevated: '#1E293B',  // Slate 800 — elementos elevados
    },
    text: {
        primary: '#F1F5F9',   // Slate 100 — texto principal (quase branco, não puro)
        secondary: '#CBD5E1', // Slate 300 — texto secundário
        muted: '#94A3B8',     // Technical Slate — texto muted
    },
    brand: {
        primary: '#00B4D8',          // Electric Cyan — cor de ação principal
        primaryHover: '#0096B7',     // Electric Cyan escurecido — hover
        secondary: '#94A3B8',        // Technical Slate — elementos estruturais
        secondaryHover: '#CBD5E1',   // Slate 300 — hover do secondary
        accent: '#38BDF8',           // Sky 400 — acento complementar (cyan mais claro)
    },
    border: {
        default: 'rgba(148, 163, 184, 0.15)',    // Technical Slate c/ alpha
        subtle: 'rgba(148, 163, 184, 0.08)',      // Technical Slate sutil
        emphasis: 'rgba(0, 180, 216, 0.35)',       // Electric Cyan c/ alpha
    },
    status: {
        success: '#34D399',   // Emerald 400
        error: '#F87171',     // Red 400
        warning: '#FBBF24',   // Amber 400
        info: '#38BDF8',      // Sky 400 (harmoniza com cyan)
    },
    glow: {
        primary: 'rgba(0, 180, 216, 0.25)',       // Electric Cyan glow
        primaryLg: 'rgba(0, 180, 216, 0.45)',     // Electric Cyan glow intenso
        secondary: 'rgba(148, 163, 184, 0.2)',    // Technical Slate glow
    },
};

export const light: ThemeColors = {
    background: {
        content: '#F8FAFC',   // Slate 50
        surface: '#F1F5F9',   // Slate 100
        elevated: '#E2E8F0',  // Slate 200
    },
    text: {
        primary: '#0A1929',   // Deep Void Blue — contraste máximo
        secondary: '#334155', // Slate 700
        muted: '#64748B',     // Slate 500
    },
    brand: {
        primary: '#0096B7',          // Electric Cyan escurecido (legibilidade em fundo claro)
        primaryHover: '#007A96',     // Cyan mais escuro
        secondary: '#64748B',        // Slate 500
        secondaryHover: '#475569',   // Slate 600
        accent: '#0284C7',           // Sky 600
    },
    border: {
        default: 'rgba(10, 25, 41, 0.12)',       // Deep Void Blue c/ alpha
        subtle: 'rgba(10, 25, 41, 0.06)',         // Deep Void Blue sutil
        emphasis: 'rgba(0, 150, 183, 0.3)',        // Cyan c/ alpha
    },
    status: {
        success: '#059669',   // Emerald 600
        error: '#DC2626',     // Red 600
        warning: '#D97706',   // Amber 600
        info: '#0284C7',      // Sky 600
    },
    glow: {
        primary: 'rgba(0, 150, 183, 0.15)',
        primaryLg: 'rgba(0, 150, 183, 0.3)',
        secondary: 'rgba(100, 116, 139, 0.15)',
    },
};

// ===== Theme Registry =====

export type ThemeName = 'dark' | 'light';

export const themes: Record<ThemeName, ThemeColors> = {
    dark,
    light,
};
