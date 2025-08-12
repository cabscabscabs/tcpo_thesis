// Theme Configuration - Easy to customize appearance
// Modify these values to change the look and feel of your web app

export const themeConfig = {
  // Brand Identity - Change these to match your brand
  brand: {
    name: 'USTP TPCO',
    tagline: 'Technology Transfer Office',
    logo: '/logo.png', // Path to your logo
  },

  // Color Scheme - Modify these colors to change the entire appearance
  colors: {
    // Primary Brand Color (Main brand color used throughout the app)
    primary: {
      main: '#003366',        // Deep Navy Blue - Change this for main brand color
      light: '#004080',       // Lighter shade
      dark: '#002040',        // Darker shade
      contrast: '#FFFFFF',    // Text color on primary background
    },
    
    // Secondary Brand Color (Accent color for highlights and CTAs)
    secondary: {
      main: '#FFD700',        // Vibrant Gold - Change this for accent color
      light: '#FFE44D',       // Lighter shade
      dark: '#E6C200',        // Darker shade
      contrast: '#003366',    // Text color on secondary background
    },
    
    // Accent Color (Third color for variety)
    accent: {
      main: '#CD7F32',        // Warm Bronze - Change this for third color
      light: '#D4A574',       // Lighter shade
      dark: '#B8860B',        // Darker shade
      contrast: '#FFFFFF',    // Text color on accent background
    },
    
    // Neutral Colors (Backgrounds, text, borders)
    neutral: {
      white: '#FFFFFF',
      light: '#F8F9FA',       // Light background
      gray: '#6C757D',        // Medium gray
      dark: '#212529',        // Dark text
    },
    
    // Semantic Colors (Success, warning, error states)
    semantic: {
      success: '#28A745',     // Green for success
      warning: '#FFC107',     // Yellow for warnings
      error: '#DC3545',       // Red for errors
      info: '#17A2B8',        // Blue for information
    },
  },

  // Typography - Change fonts and sizes
  typography: {
    // Font Families
    fonts: {
      primary: 'Roboto, sans-serif',      // Main heading font
      secondary: 'Open Sans, sans-serif',  // Body text font
      mono: 'Fira Code, monospace',        // Code font
    },
    
    // Font Sizes (in rem units)
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
    
    // Font Weights
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Layout & Spacing - Adjust spacing and layout
  layout: {
    // Container widths
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    // Spacing scale (in rem units)
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
    
    // Border radius
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
  },

  // Shadows & Effects - Customize shadows and visual effects
  effects: {
    // Box shadows
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      
      // Custom brand shadows
      primary: '0 4px 20px rgb(0 51 102 / 0.1)',
      secondary: '0 4px 20px rgb(255 215 0 / 0.2)',
      accent: '0 4px 20px rgb(205 127 50 / 0.15)',
    },
    
    // Transitions
    transitions: {
      fast: 'all 0.15s ease-in-out',
      normal: 'all 0.3s ease-in-out',
      slow: 'all 0.5s ease-in-out',
      smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Component-specific settings
  components: {
    // Button styles
    button: {
      borderRadius: '0.5rem',
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
        xl: '1.25rem 2.5rem',
      },
    },
    
    // Card styles
    card: {
      borderRadius: '0.75rem',
      padding: '1.5rem',
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    
    // Navigation styles
    navigation: {
      height: '4rem',
      background: 'rgba(0, 51, 102, 0.95)',
      backdropBlur: '10px',
    },
  },

  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Export types for TypeScript support
export type ThemeConfig = typeof themeConfig;
export type ColorScheme = typeof themeConfig.colors;
export type TypographyConfig = typeof themeConfig.typography;
