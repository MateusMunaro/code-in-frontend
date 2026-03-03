// ===== Theme Typography Types =====

export interface ThemeTypography {
    fontFamily: {
        display: string;  // VT323 — headings, titles
        body: string;     // JetBrains Mono — body text, code
    };
    fontSize: {
        h1: string;       // 3.75rem (60px)
        h2: string;       // 2.25rem (36px)
        h3: string;       // 1.5rem (24px)
        body: string;     // 1rem (16px)
        caption: string;  // 0.875rem (14px)
        small: string;    // 0.75rem (12px)
    };
    fontWeight: {
        normal: number;   // 400
        bold: number;     // 700
    };
    letterSpacing: {
        normal: string;   // '0em'
        wide: string;     // '0.05em'
        widest: string;   // '0.1em'
    };
}

// ===== Typography Definition =====
//
// Display: VT323 (Google Fonts) — retro terminal aesthetic
//   Used for: H1 headlines, page titles, large labels
//
// Body: JetBrains Mono (Google Fonts) — modern monospace
//   Used for: body text, code, captions, small labels
//
// ================================

export const typography: ThemeTypography = {
    fontFamily: {
        display: '"VT323", monospace',
        body: '"JetBrains Mono", monospace',
    },
    fontSize: {
        h1: '3.75rem',    // 60px
        h2: '2.25rem',    // 36px
        h3: '1.5rem',     // 24px
        body: '1rem',     // 16px
        caption: '0.875rem', // 14px
        small: '0.75rem', // 12px
    },
    fontWeight: {
        normal: 400,
        bold: 700,
    },
    letterSpacing: {
        normal: '0em',
        wide: '0.05em',
        widest: '0.1em',
    },
};
