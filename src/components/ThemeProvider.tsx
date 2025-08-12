import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { theme, Theme, generateCSSVariables } from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateTheme: (updates: Partial<Theme>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(defaultTheme);
  const [customTheme, setCustomTheme] = useState<Theme>(theme);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const cssVars = generateCSSVariables();
    
    // Apply custom theme variables
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply current theme class
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
  }, [currentTheme, customTheme]);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('ustp-theme') as 'light' | 'dark';
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('ustp-theme', newTheme);
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
    localStorage.setItem('ustp-theme', theme);
  };

  const updateTheme = (updates: Partial<Theme>) => {
    setCustomTheme(prev => ({ ...prev, ...updates }));
  };

  const value: ThemeContextType = {
    theme: customTheme,
    currentTheme,
    toggleTheme,
    setTheme,
    updateTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get specific theme values
export const useThemeValue = (path: string) => {
  const { theme } = useTheme();
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
