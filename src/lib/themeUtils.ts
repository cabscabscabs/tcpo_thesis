import { themeConfig } from './themeConfig';

// Utility functions for working with the theme system

/**
 * Get a color value from the theme
 * @param path - Dot notation path to the color (e.g., 'primary.main', 'semantic.success')
 * @returns The color value or undefined if not found
 */
export const getColor = (path: string): string | undefined => {
  const keys = path.split('.');
  let value: any = themeConfig.colors;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};

/**
 * Get a typography value from the theme
 * @param path - Dot notation path to the typography value (e.g., 'fonts.primary', 'sizes.xl')
 * @returns The typography value or undefined if not found
 */
export const getTypography = (path: string): string | undefined => {
  const keys = path.split('.');
  let value: any = themeConfig.typography;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};

/**
 * Get a spacing value from the theme
 * @param size - The spacing size (e.g., 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl')
 * @returns The spacing value or undefined if not found
 */
export const getSpacing = (size: string): string | undefined => {
  return themeConfig.layout.spacing[size as keyof typeof themeConfig.layout.spacing];
};

/**
 * Get a border radius value from the theme
 * @param size - The border radius size (e.g., 'sm', 'base', 'md', 'lg', 'xl', '2xl')
 * @returns The border radius value or undefined if not found
 */
export const getBorderRadius = (size: string): string | undefined => {
  return themeConfig.layout.borderRadius[size as keyof typeof themeConfig.layout.borderRadius];
};

/**
 * Get a shadow value from the theme
 * @param type - The shadow type (e.g., 'sm', 'base', 'md', 'lg', 'xl', 'primary', 'secondary', 'accent')
 * @returns The shadow value or undefined if not found
 */
export const getShadow = (type: string): string | undefined => {
  return themeConfig.effects.shadows[type as keyof typeof themeConfig.effects.shadows];
};

/**
 * Get a transition value from the theme
 * @param type - The transition type (e.g., 'fast', 'normal', 'slow', 'smooth')
 * @returns The transition value or undefined if not found
 */
export const getTransition = (type: string): string | undefined => {
  return themeConfig.effects.transitions[type as keyof typeof themeConfig.effects.transitions];
};

/**
 * Get a breakpoint value from the theme
 * @param size - The breakpoint size (e.g., 'sm', 'md', 'lg', 'xl', '2xl')
 * @returns The breakpoint value or undefined if not found
 */
export const getBreakpoint = (size: string): string | undefined => {
  return themeConfig.breakpoints[size as keyof typeof themeConfig.breakpoints];
};

/**
 * Create a CSS custom property string
 * @param name - The custom property name
 * @param value - The value to assign
 * @returns CSS custom property string
 */
export const createCSSProperty = (name: string, value: string): string => {
  return `--${name}: ${value};`;
};

/**
 * Generate CSS variables for the entire theme
 * @returns Object with CSS custom properties
 */
export const generateThemeCSSVariables = (): Record<string, string> => {
  const cssVars: Record<string, string> = {};
  
  // Colors
  Object.entries(themeConfig.colors).forEach(([category, value]) => {
    if (typeof value === 'string') {
      cssVars[`--color-${category}`] = value;
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subCategory, subValue]) => {
        cssVars[`--color-${category}-${subCategory}`] = subValue;
      });
    }
  });
  
  // Typography
  cssVars['--font-primary'] = themeConfig.typography.fonts.primary;
  cssVars['--font-secondary'] = themeConfig.typography.fonts.secondary;
  cssVars['--font-mono'] = themeConfig.typography.fonts.mono;
  
  // Spacing
  Object.entries(themeConfig.layout.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });
  
  // Border radius
  Object.entries(themeConfig.layout.borderRadius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });
  
  // Shadows
  Object.entries(themeConfig.effects.shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });
  
  // Transitions
  Object.entries(themeConfig.effects.transitions).forEach(([key, value]) => {
    cssVars[`--transition-${key}`] = value;
  });
  
  // Breakpoints
  Object.entries(themeConfig.breakpoints).forEach(([key, value]) => {
    cssVars[`--breakpoint-${key}`] = value;
  });
  
  return cssVars;
};

/**
 * Apply theme CSS variables to the document root
 */
export const applyThemeToDOM = (): void => {
  const root = document.documentElement;
  const cssVars = generateThemeCSSVariables();
  
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

/**
 * Create a CSS class with theme values
 * @param className - The CSS class name
 * @param properties - Object with CSS properties and their theme values
 * @returns CSS class string
 */
export const createThemeClass = (
  className: string, 
  properties: Record<string, string>
): string => {
  const cssProperties = Object.entries(properties)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');
  
  return `.${className} {\n${cssProperties}\n}`;
};

/**
 * Get component-specific theme values
 * @param component - The component name
 * @param property - The property to get
 * @returns The component theme value or undefined if not found
 */
export const getComponentTheme = (component: string, property: string): any => {
  const componentConfig = themeConfig.components[component as keyof typeof themeConfig.components];
  if (componentConfig && typeof componentConfig === 'object') {
    return componentConfig[property as keyof typeof componentConfig];
  }
  return undefined;
};

/**
 * Convert hex color to HSL
 * @param hex - Hex color string
 * @returns HSL color string
 */
export const hexToHSL = (hex: string): string => {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

/**
 * Convert hex color to RGB
 * @param hex - Hex color string
 * @returns RGB color string
 */
export const hexToRGB = (hex: string): string => {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `${r}, ${g}, ${b}`;
};
