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

// ===== Retro Terminal Palette =====
//
// Matrix Green:        #00FF41  — Primary action, accents
// Primary Dim:         #008F11  — Subtle green accent
// Deep Obsidian:       #0D0D0D  — Page background
// Surface Dark:        #1A1A1A  — Card/panel surfaces
// Border Dark:         #333333  — Default borders
// Phosphor White:      #F2F2F2  — Off-white main text
// Text Dim:            #A0A0A0  — Secondary text
// Kernel Panic:        #FF3333  — Error state
// Warning:             #FFCC00  — Warning state
// ================================

// ===== Theme Definitions =====

export const dark: ThemeColors = {
    background: {
        content: '#0D0D0D',   // Deep Obsidian — page background
        surface: '#1A1A1A',   // Surface Dark — cards, panels
        elevated: '#252525',  // Elevated — modals, dropdowns
    },
    text: {
        primary: '#F2F2F2',   // Phosphor White — main text
        secondary: '#A0A0A0', // Text Dim — secondary text
        muted: '#666666',     // Muted — disabled, hints
    },
    brand: {
        primary: '#00FF41',          // Matrix Green — primary action
        primaryHover: '#33FF6A',     // Matrix Green lighter — hover
        secondary: '#A0A0A0',        // Text Dim — structural elements
        secondaryHover: '#F2F2F2',   // Phosphor White — hover
        accent: '#008F11',           // Primary Dim — accent
    },
    border: {
        default: '#333333',                   // Border Dark
        subtle: 'rgba(0, 255, 65, 0.15)',     // Matrix Green subtle
        emphasis: 'rgba(0, 255, 65, 0.5)',    // Matrix Green emphasis
    },
    status: {
        success: '#00FF41',   // Matrix Green
        error: '#FF3333',     // Kernel Panic
        warning: '#FFCC00',   // Warning Yellow
        info: '#00B4D8',      // Info Cyan
    },
    glow: {
        primary: 'rgba(0, 255, 65, 0.25)',    // Matrix Green glow
        primaryLg: 'rgba(0, 255, 65, 0.45)',  // Matrix Green glow intense
        secondary: 'rgba(51, 51, 51, 0.3)',   // Dim border glow
    },
};

export const light: ThemeColors = {
    background: {
        content: '#F3F4F6',   // Light gray background
        surface: '#FFFFFF',   // White surfaces
        elevated: '#E5E7EB',  // Elevated elements
    },
    text: {
        primary: '#0D0D0D',   // Deep Obsidian — max contrast
        secondary: '#4B5563', // Gray 600
        muted: '#9CA3AF',     // Gray 400
    },
    brand: {
        primary: '#008F11',          // Primary Dim — legible on light bg
        primaryHover: '#006B0D',     // Darker green hover
        secondary: '#6B7280',        // Gray 500
        secondaryHover: '#374151',   // Gray 700
        accent: '#00FF41',           // Matrix Green accent
    },
    border: {
        default: 'rgba(0, 0, 0, 0.12)',       // Subtle dark border
        subtle: 'rgba(0, 143, 17, 0.1)',       // Green tint subtle
        emphasis: 'rgba(0, 143, 17, 0.35)',    // Green tint emphasis
    },
    status: {
        success: '#059669',   // Emerald 600
        error: '#DC2626',     // Red 600
        warning: '#D97706',   // Amber 600
        info: '#0284C7',      // Sky 600
    },
    glow: {
        primary: 'rgba(0, 143, 17, 0.15)',
        primaryLg: 'rgba(0, 143, 17, 0.3)',
        secondary: 'rgba(107, 114, 128, 0.15)',
    },
};

// ===== Theme Registry =====

export type ThemeName = 'dark' | 'light';

export const themes: Record<ThemeName, ThemeColors> = {
    dark,
    light,
};
