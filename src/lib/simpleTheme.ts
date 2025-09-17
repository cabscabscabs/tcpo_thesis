// Simple Theme Configuration File
// This file allows you to easily customize the look and feel of your website
// Just change the values below and see the changes reflected throughout your site

export const simpleTheme = {
  // COLORS
  // Primary color (main brand color)
  primary: '#1a1851',        // Deep Blue
  
  // Secondary color (accent color)
  secondary: '#fcb315',      // Yellow
  
  // Neutral colors
  white: '#ffffff',
  lightGray: '#f8f9fa',
  gray: '#6c757d',
  darkGray: '#343a40',
  black: '#000000',
  
  // Status colors
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
  
  // TYPOGRAPHY
  // Font families
  fonts: {
    headings: 'Roboto, sans-serif',      // Font for headings (h1, h2, etc.)
    body: 'Open Sans, sans-serif',       // Font for body text
    monospace: 'Fira Code, monospace',   // Font for code
  },
  
  // Font sizes (in pixels)
  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  
  // Font weights
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // SPACING
  // Spacing scale (in pixels)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  // BORDER RADIUS
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // SHADOWS
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // BREAKPOINTS (for responsive design)
  breakpoints: {
    sm: '640px',    // Small devices (phones)
    md: '768px',    // Medium devices (tablets)
    lg: '1024px',   // Large devices (desktops)
    xl: '1280px',   // Extra large devices (large desktops)
  }
} as const;

// Helper function to convert hex color to rgba
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper function to lighten a color
export const lightenColor = (hex: string, percent: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const newR = Math.min(255, r + (255 - r) * percent / 100);
  const newG = Math.min(255, g + (255 - g) * percent / 100);
  const newB = Math.min(255, b + (255 - b) * percent / 100);
  
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

// Helper function to darken a color
export const darkenColor = (hex: string, percent: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const newR = Math.max(0, r * (1 - percent / 100));
  const newG = Math.max(0, g * (1 - percent / 100));
  const newB = Math.max(0, b * (1 - percent / 100));
  
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

export default simpleTheme;