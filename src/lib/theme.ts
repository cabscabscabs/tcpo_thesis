// Theme Configuration for USTP TPCO Web App
// This file centralizes all design tokens and makes it easy to adjust the appearance

export const theme = {
  // Color Palette
  colors: {
    // Primary Brand Colors
    primary: {
      main: 'hsl(240 80% 15%)',      // Deep Blue - Changed to #120b44 equivalent
      light: 'hsl(240 80% 20%)',     // Lighter Blue
      dark: 'hsl(240 80% 10%)',      // Darker Blue
      contrast: 'hsl(0 0% 100%)',     // White text
    },
    
    // Secondary Brand Colors
    secondary: {
      main: 'hsl(40 70% 58%)',       // Yellow - Changed to #e7b841 equivalent
      light: 'hsl(40 70% 68%)',      // Lighter Yellow
      dark: 'hsl(40 70% 48%)',       // Darker Yellow
      contrast: 'hsl(240 80% 15%)',  // Deep Blue text
    },
    
    // Accent Colors
    accent: {
      main: 'hsl(32 61% 46%)',        // Warm Bronze
      light: 'hsl(32 61% 56%)',       // Lighter Bronze
      dark: 'hsl(32 61% 36%)',        // Darker Bronze
      contrast: 'hsl(0 0% 100%)',     // White text
    },
    
    // Neutral Colors
    neutral: {
      white: 'hsl(0 0% 100%)',
      light: 'hsl(210 67% 94%)',      // Light Sky Blue
      gray: 'hsl(0 0% 20%)',          // Charcoal Gray
      dark: 'hsl(0 0% 15%)',
    },
    
    // Semantic Colors
    success: 'hsl(142 76% 36%)',
    warning: 'hsl(38 92% 50%)',
    error: 'hsl(0 84% 60%)',
    info: 'hsl(210 100% 50%)',
  },

  // Typography
  typography: {
    fonts: {
      primary: 'Roboto, sans-serif',
      secondary: 'Open Sans, sans-serif',
    },
    
    sizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },
    
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    
    // Custom brand shadows
    primary: '0 4px 20px hsl(240 80% 15% / 0.1)',
    secondary: '0 4px 20px hsl(40 70% 58% / 0.2)',
    accent: '0 4px 20px hsl(32 61% 46% / 0.15)',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, hsl(240 80% 15%), hsl(240 80% 20%))',
    secondary: 'linear-gradient(135deg, hsl(40 70% 58%), hsl(40 70% 68%))',
    accent: 'linear-gradient(135deg, hsl(32 61% 46%), hsl(32 61% 56%))',
    ustp: 'linear-gradient(135deg, hsl(240 80% 15%), hsl(32 61% 46%))',
    hero: 'linear-gradient(135deg, hsl(240 80% 15% / 0.8), hsl(240 80% 20% / 0.8))',
  },

  // Transitions
  transitions: {
    fast: 'all 0.15s ease-in-out',
    normal: 'all 0.3s ease-in-out',
    slow: 'all 0.5s ease-in-out',
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index
  zIndex: {
    base: '0',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modal: '1040',
    popover: '1050',
    tooltip: '1060',
    toast: '1070',
  },
} as const;

// Helper function to get theme values
export const getThemeValue = (path: string) => {
  const keys = path.split('.');
  let value: any = theme;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};

// CSS Variable generator for the theme
export const generateCSSVariables = () => {
  const cssVars: Record<string, string> = {};
  
  // Generate CSS variables for colors
  Object.entries(theme.colors).forEach(([category, value]) => {
    if (typeof value === 'string') {
      cssVars[`--color-${category}`] = value;
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subCategory, subValue]) => {
        cssVars[`--color-${category}-${subCategory}`] = subValue;
      });
    }
  });
  
  // Generate CSS variables for other theme properties
  cssVars['--font-primary'] = theme.typography.fonts.primary;
  cssVars['--font-secondary'] = theme.typography.fonts.secondary;
  cssVars['--transition-normal'] = theme.transitions.normal;
  cssVars['--shadow-primary'] = theme.shadows.primary;
  cssVars['--shadow-secondary'] = theme.shadows.secondary;
  cssVars['--shadow-accent'] = theme.shadows.accent;
  
  return cssVars;
};

// Export theme types
export type Theme = typeof theme;
export type ColorPalette = typeof theme.colors;
export type Typography = typeof theme.typography;
