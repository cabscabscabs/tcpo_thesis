# USTP TPCO Theme System Guide

This guide explains how to use the new theme system to easily customize the appearance of your web app.

## 🎨 Overview

The theme system provides a centralized way to manage colors, typography, spacing, shadows, and other visual properties. By modifying a few configuration files, you can completely transform the look and feel of your application.

## 📁 Theme Files Structure

```
src/lib/
├── theme.ts              # Core theme definitions and types
├── themeConfig.ts        # Easy-to-customize theme configuration
├── themeUtils.ts         # Utility functions for working with themes
└── components/
    ├── ThemeProvider.tsx # Theme context provider
    └── ThemeToggle.tsx   # Theme switcher component
```

## 🚀 Quick Start

### 1. Basic Color Customization

To change the main brand colors, edit `src/lib/themeConfig.ts`:

```typescript
// Change your primary brand color
colors: {
  primary: {
    main: '#1E40AF',        // Change this to your brand blue
    light: '#3B82F6',       // Lighter shade
    dark: '#1E3A8A',        // Darker shade
    contrast: '#FFFFFF',    // Text color on primary background
  },
  
  // Change your accent color
  secondary: {
    main: '#F59E0B',        // Change this to your brand orange
    light: '#FBBF24',       // Lighter shade
    dark: '#D97706',        // Darker shade
    contrast: '#FFFFFF',    // Text color on secondary background
  },
}
```

### 2. Typography Customization

To change fonts and text styles:

```typescript
typography: {
  fonts: {
    primary: 'Inter, sans-serif',      // Change main heading font
    secondary: 'Source Sans Pro, sans-serif',  // Change body text font
    mono: 'JetBrains Mono, monospace', // Change code font
  },
  
  sizes: {
    '2xl': '2rem',    // Change heading size (32px)
    '3xl': '2.5rem',  // Change large heading size (40px)
    '4xl': '3rem',    // Change extra large heading size (48px)
  },
}
```

### 3. Spacing and Layout

To adjust spacing and layout:

```typescript
layout: {
  spacing: {
    lg: '2rem',        // Change large spacing (32px)
    xl: '3rem',        // Change extra large spacing (48px)
    '2xl': '4rem',     // Change 2xl spacing (64px)
  },
  
  borderRadius: {
    lg: '0.75rem',     // Change large border radius (12px)
    xl: '1rem',        // Change extra large border radius (16px)
  },
}
```

## 🎯 Advanced Customization

### Component-Specific Themes

Customize specific components:

```typescript
components: {
  button: {
    borderRadius: '1rem',           // Change button border radius
    padding: {
      lg: '1.25rem 2.5rem',        // Change large button padding
      xl: '1.5rem 3rem',           // Change extra large button padding
    },
  },
  
  card: {
    borderRadius: '1rem',           // Change card border radius
    padding: '2rem',                // Change card padding
    shadow: '0 8px 25px rgb(0 0 0 / 0.15)', // Change card shadow
  },
  
  navigation: {
    height: '5rem',                 // Change navigation height
    background: 'rgba(30, 64, 175, 0.95)', // Change navigation background
    backdropBlur: '20px',           // Change backdrop blur
  },
}
```

### Custom Shadows and Effects

```typescript
effects: {
  shadows: {
    // Add custom shadows
    'brand': '0 8px 32px rgb(30, 64, 175 / 0.2)',
    'accent': '0 8px 32px rgb(245, 158, 11 / 0.25)',
    'elevated': '0 20px 40px rgb(0 0 0 / 0.1)',
  },
  
  transitions: {
    // Add custom transitions
    'bounce': 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'elastic': 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
}
```

## 🔧 Using Theme Values in Components

### 1. Using the useTheme Hook

```tsx
import { useTheme } from '@/components/ThemeProvider';

const MyComponent = () => {
  const { theme, currentTheme, toggleTheme } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: theme.colors.primary.main,
      color: theme.colors.primary.contrast 
    }}>
      <button onClick={toggleTheme}>
        Switch to {currentTheme === 'light' ? 'dark' : 'light'} mode
      </button>
    </div>
  );
};
```

### 2. Using Theme Utilities

```tsx
import { getColor, getSpacing, getShadow } from '@/lib/themeUtils';

const MyComponent = () => {
  return (
    <div style={{
      backgroundColor: getColor('primary.main'),
      padding: getSpacing('lg'),
      boxShadow: getShadow('primary'),
    }}>
      Content with theme values
    </div>
  );
};
```

### 3. Using CSS Custom Properties

```tsx
const MyComponent = () => {
  return (
    <div className="bg-[var(--color-primary-main)] p-[var(--spacing-lg)] shadow-[var(--shadow-primary)]">
      Content using CSS variables
    </div>
  );
};
```

## 🌙 Dark Mode Support

The theme system automatically supports dark mode. To customize dark mode colors:

```typescript
// In src/index.css, modify the .dark selector
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  // ... other dark mode variables
}
```

## 📱 Responsive Design

Theme breakpoints are automatically applied:

```typescript
// Use in components
<div className="
  text-sm md:text-base lg:text-lg xl:text-xl
  p-4 md:p-6 lg:p-8 xl:p-10
">
  Responsive content
</div>
```

## 🎨 Creating Custom Theme Variants

### 1. Add New Color Variants

```typescript
// In themeConfig.ts
colors: {
  // ... existing colors
  
  // Add new color variants
  success: {
    light: '#4ADE80',
    main: '#22C55E',
    dark: '#16A34A',
    contrast: '#FFFFFF',
  },
  
  warning: {
    light: '#FCD34D',
    main: '#F59E0B',
    dark: '#D97706',
    contrast: '#000000',
  },
}
```

### 2. Add New Component Themes

```typescript
components: {
  // ... existing components
  
  // Add new component themes
  alert: {
    borderRadius: '0.5rem',
    padding: '1rem',
    border: '1px solid',
  },
  
  modal: {
    borderRadius: '1rem',
    padding: '2rem',
    shadow: '0 25px 50px rgb(0 0 0 / 0.25)',
  },
}
```

## 🔄 Theme Switching

The theme system includes a built-in theme toggle:

```tsx
import ThemeToggle from '@/components/ThemeToggle';

// Basic toggle
<ThemeToggle />

// Toggle with label
<ThemeToggle showLabel />

// Custom styling
<ThemeToggle className="custom-class" />
```

## 📊 Performance Considerations

- Theme values are cached and only recalculated when necessary
- CSS custom properties are used for optimal performance
- Theme switching is smooth with CSS transitions
- No unnecessary re-renders when theme changes

## 🐛 Troubleshooting

### Common Issues

1. **Theme not applying**: Make sure `ThemeProvider` wraps your app
2. **Colors not updating**: Check that you're editing the correct file (`themeConfig.ts`)
3. **Dark mode not working**: Verify CSS variables are properly defined in `.dark` selector

### Debug Mode

Enable debug logging:

```typescript
// In ThemeProvider.tsx, add console.log for debugging
useEffect(() => {
  console.log('Theme updated:', customTheme);
  console.log('Current theme:', currentTheme);
}, [customTheme, currentTheme]);
```

## 📚 Best Practices

1. **Consistency**: Use theme values consistently across all components
2. **Semantic naming**: Use descriptive names for colors (e.g., `primary.main` not `blue`)
3. **Accessibility**: Ensure sufficient contrast ratios between colors
4. **Performance**: Avoid inline styles when possible, use CSS classes
5. **Documentation**: Document any custom theme values you add

## 🎯 Example: Complete Theme Overhaul

Here's how to completely change your app's appearance:

```typescript
// In themeConfig.ts
export const themeConfig = {
  colors: {
    primary: {
      main: '#7C3AED',        // Purple theme
      light: '#A78BFA',
      dark: '#5B21B6',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#F59E0B',        // Amber accent
      light: '#FBBF24',
      dark: '#D97706',
      contrast: '#000000',
    },
    accent: {
      main: '#10B981',        // Emerald accent
      light: '#34D399',
      dark: '#059669',
      contrast: '#FFFFFF',
    },
  },
  
  typography: {
    fonts: {
      primary: 'Poppins, sans-serif',
      secondary: 'Inter, sans-serif',
    },
  },
  
  layout: {
    spacing: {
      lg: '2rem',
      xl: '3rem',
    },
    borderRadius: {
      lg: '1rem',
      xl: '1.5rem',
    },
  },
};
```

This will give your app a completely different purple-based appearance with modern typography and spacing.

## 🤝 Contributing

When adding new theme features:

1. Update the appropriate configuration file
2. Add TypeScript types if needed
3. Update this documentation
4. Test in both light and dark modes
5. Ensure accessibility compliance

---

**Happy theming! 🎨**

For more help, check the component examples or create an issue in the repository.
