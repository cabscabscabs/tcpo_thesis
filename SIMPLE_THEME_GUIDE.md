# Simple Theme Guide

This guide explains how to use the new simple theme configuration file to easily customize your website's appearance.

## File Location

The theme configuration is located at: `src/lib/simpleTheme.ts`

## How to Customize

### 1. Colors

To change the main colors of your website, simply modify these values in the [simpleTheme.ts](file:///c:/Users/JODIE/Desktop/React/ustp-tpco/src/lib/simpleTheme.ts) file:

```typescript
export const simpleTheme = {
  // COLORS
  primary: '#120b44',        // Change this to your primary brand color
  secondary: '#e7b841',      // Change this to your secondary/accent color
  // ... other colors
}
```

For example, to change to a green theme:
```typescript
export const simpleTheme = {
  primary: '#2e7d32',        // Green
  secondary: '#ff9800',      // Orange
  // ... other colors
}
```

### 2. Typography

To change fonts and text sizes:

```typescript
fonts: {
  headings: 'Poppins, sans-serif',      // Font for headings
  body: 'Lato, sans-serif',             // Font for body text
},
fontSizes: {
  base: '18px',    // Change base font size
  // ... other sizes
}
```

### 3. Spacing

To adjust spacing throughout your site:

```typescript
spacing: {
  md: '20px',    // Change medium spacing
  lg: '30px',    // Change large spacing
  // ... other spacing
}
```

## How to Use in Components

### 1. Import the Theme

In any component file, import the theme:

```typescript
import { simpleTheme } from '@/lib/simpleTheme';
```

### 2. Use Theme Values

Use the theme values directly in your components:

```tsx
import { simpleTheme } from '@/lib/simpleTheme';

const MyComponent = () => {
  return (
    <div style={{
      backgroundColor: simpleTheme.primary,
      color: simpleTheme.white,
      padding: simpleTheme.spacing.lg,
      borderRadius: simpleTheme.borderRadius.md,
      fontFamily: simpleTheme.fonts.body
    }}>
      <h1 style={{
        color: simpleTheme.secondary,
        fontSize: simpleTheme.fontSizes['3xl'],
        fontWeight: simpleTheme.fontWeights.bold
      }}>
        This is a heading
      </h1>
      <p>This is some content with the theme applied</p>
    </div>
  );
};

export default MyComponent;
```

### 3. Using Helper Functions

The theme includes helper functions for color manipulation:

```tsx
import { simpleTheme, lightenColor, darkenColor } from '@/lib/simpleTheme';

const MyComponent = () => {
  return (
    <button style={{
      backgroundColor: simpleTheme.primary,
      color: simpleTheme.white,
      border: 'none',
      padding: simpleTheme.spacing.md,
      borderRadius: simpleTheme.borderRadius.sm,
      // Hover effect with darkened primary color
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = darkenColor(simpleTheme.primary, 10);
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = simpleTheme.primary;
    }}>
      Click Me
    </button>
  );
};
```

## CSS Custom Properties (Optional)

If you want to use the theme values in CSS, you can create CSS custom properties in your [index.css](file:///c:/Users/JODIE/Desktop/React/ustp-tpco/src/index.css) file:

```css
:root {
  --primary-color: #120b44;
  --secondary-color: #e7b841;
  --font-heading: 'Roboto, sans-serif';
  --font-body: 'Open Sans, sans-serif';
}

.my-component {
  background-color: var(--primary-color);
  color: white;
  font-family: var(--font-body);
}
```

## Responsive Design

Use the breakpoints for responsive design:

```tsx
import { simpleTheme } from '@/lib/simpleTheme';

const MyComponent = () => {
  return (
    <div style={{
      padding: simpleTheme.spacing.md,
    }}>
      <style jsx>{`
        .responsive-content {
          font-size: ${simpleTheme.fontSizes.base};
        }
        
        @media (min-width: ${simpleTheme.breakpoints.md}) {
          .responsive-content {
            font-size: ${simpleTheme.fontSizes.xl};
          }
        }
        
        @media (min-width: ${simpleTheme.breakpoints.lg}) {
          .responsive-content {
            font-size: ${simpleTheme.fontSizes['2xl'];
          }
        }
      `}</style>
      
      <div className="responsive-content">
        This text changes size based on screen width
      </div>
    </div>
  );
};
```

## Tips for Easy Customization

1. **Start with Colors**: Change the primary and secondary colors first to see immediate impact
2. **Test on Multiple Pages**: After making changes, check several pages to ensure consistency
3. **Use Hex Values**: Stick to hex color values (#RRGGBB) for consistency
4. **Maintain Contrast**: Ensure text remains readable with your color choices
5. **Document Changes**: Keep notes on what changes you've made for future reference

## Example Theme Variations

### Warm Theme
```typescript
primary: '#8b4513',        // Brown
secondary: '#ff8c00',      // Dark Orange
```

### Cool Theme
```typescript
primary: '#1976d2',        // Blue
secondary: '#00bcd4',      // Cyan
```

### Vibrant Theme
```typescript
primary: '#7b1fa2',        // Purple
secondary: '#f50057',      // Pink
```

## Troubleshooting

1. **Changes Not Showing**: Make sure you've saved the file and restarted the development server if needed
2. **Color Contrast Issues**: Use online contrast checkers to ensure accessibility
3. **Font Issues**: Make sure any new fonts are imported in your [index.css](file:///c:/Users/JODIE/Desktop/React/ustp-tpco/src/index.css) file

With this simple theme system, you can easily customize your website's appearance without needing to understand complex theme configurations.