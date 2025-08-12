import { useTheme } from './ThemeProvider';
import { getColor, getSpacing, getShadow } from '@/lib/themeUtils';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

/**
 * Example component demonstrating different ways to use the theme system
 * This component shows various approaches to applying theme values
 */
export const ThemeExample = () => {
  const { theme, currentTheme, toggleTheme } = useTheme();

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Theme System Examples</h1>
        <p className="text-lg text-muted-foreground mb-6">
          This component demonstrates different ways to use the theme system
        </p>
        
        {/* Theme Toggle */}
        <Button onClick={toggleTheme} variant="outline" className="mb-8">
          Current Theme: {currentTheme === 'light' ? '🌞 Light' : '🌙 Dark'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Method 1: Using useTheme Hook */}
        <Card className="border-2 border-dashed border-primary">
          <CardHeader>
            <CardTitle className="text-primary">useTheme Hook</CardTitle>
            <CardDescription>
              Access theme values directly from the context
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="p-4 rounded-lg text-center font-semibold"
              style={{
                backgroundColor: theme.colors.primary.main,
                color: theme.colors.primary.contrast,
              }}
            >
              Primary Color from Hook
            </div>
            <div 
              className="p-4 rounded-lg text-center font-semibold"
              style={{
                backgroundColor: theme.colors.secondary.main,
                color: theme.colors.secondary.contrast,
              }}
            >
              Secondary Color from Hook
            </div>
          </CardContent>
        </Card>

        {/* Method 2: Using Theme Utilities */}
        <Card className="border-2 border-dashed border-secondary">
          <CardHeader>
            <CardTitle className="text-secondary">Theme Utilities</CardTitle>
            <CardDescription>
              Use utility functions to get theme values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="p-4 rounded-lg text-center font-semibold"
              style={{
                backgroundColor: getColor('primary.main'),
                color: getColor('primary.contrast'),
                padding: getSpacing('lg'),
                boxShadow: getShadow('primary'),
              }}
            >
              Using Utility Functions
            </div>
            <div 
              className="p-4 rounded-lg text-center font-semibold"
              style={{
                backgroundColor: getColor('accent.main'),
                color: getColor('accent.contrast'),
                padding: getSpacing('md'),
                boxShadow: getShadow('accent'),
              }}
            >
              Accent with Utilities
            </div>
          </CardContent>
        </Card>

        {/* Method 3: Using CSS Custom Properties */}
        <Card className="border-2 border-dashed border-accent">
          <CardHeader>
            <CardTitle className="text-accent">CSS Variables</CardTitle>
            <CardDescription>
              Use CSS custom properties with Tailwind
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[var(--color-primary-main)] text-[var(--color-primary-contrast)] p-[var(--spacing-lg)] rounded-lg text-center font-semibold shadow-[var(--shadow-primary)]">
              Primary with CSS Variables
            </div>
            <div className="bg-[var(--color-secondary-main)] text-[var(--color-secondary-contrast)] p-[var(--spacing-md)] rounded-lg text-center font-semibold shadow-[var(--shadow-secondary)]">
              Secondary with CSS Variables
            </div>
          </CardContent>
        </Card>

        {/* Method 4: Using Tailwind Theme Classes */}
        <Card className="border-2 border-dashed border-muted">
          <CardHeader>
            <CardTitle>Tailwind Theme Classes</CardTitle>
            <CardDescription>
              Use Tailwind classes that reference theme values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-theme-primary-main text-theme-primary-contrast p-6 rounded-lg text-center font-semibold shadow-theme-primary">
              Primary with Tailwind Classes
            </div>
            <div className="bg-theme-secondary-main text-theme-secondary-contrast p-4 rounded-lg text-center font-semibold shadow-theme-secondary">
              Secondary with Tailwind Classes
            </div>
          </CardContent>
        </Card>

        {/* Method 5: Dynamic Theme Switching */}
        <Card className="border-2 border-dashed border-border">
          <CardHeader>
            <CardTitle>Dynamic Theme</CardTitle>
            <CardDescription>
              Theme values that change with theme switching
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg text-center font-semibold shadow-lg transition-all duration-300 hover:scale-105">
              Dynamic Primary
            </div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg text-center font-semibold shadow-lg transition-all duration-300 hover:scale-105">
              Dynamic Secondary
            </div>
          </CardContent>
        </Card>

        {/* Method 6: Custom Theme Values */}
        <Card className="border-2 border-dashed border-destructive">
          <CardHeader>
            <CardTitle>Custom Theme Values</CardTitle>
            <CardDescription>
              Access custom theme configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="p-4 rounded-lg text-center font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: getColor('semantic.success'),
                color: 'white',
                borderRadius: '1rem',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              }}
            >
              Success State
            </div>
            <div 
              className="p-4 rounded-lg text-center font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: getColor('semantic.warning'),
                color: 'black',
                borderRadius: '1rem',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              }}
            >
              Warning State
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Information Display */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Current Theme Information</CardTitle>
          <CardDescription>
            Real-time theme values from the context
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Primary Colors:</h4>
              <div className="space-y-1">
                <div>Main: <span className="font-mono">{theme.colors.primary.main}</span></div>
                <div>Light: <span className="font-mono">{theme.colors.primary.light}</span></div>
                <div>Dark: <span className="font-mono">{theme.colors.primary.dark}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Secondary Colors:</h4>
              <div className="space-y-1">
                <div>Main: <span className="font-mono">{theme.colors.secondary.main}</span></div>
                <div>Light: <span className="font-mono">{theme.colors.secondary.light}</span></div>
                <div>Dark: <span className="font-mono">{theme.colors.secondary.dark}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Typography:</h4>
              <div className="space-y-1">
                <div>Primary Font: <span className="font-mono">{theme.typography.fonts.primary}</span></div>
                <div>Secondary Font: <span className="font-mono">{theme.typography.fonts.secondary}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Spacing:</h4>
              <div className="space-y-1">
                <div>Large: <span className="font-mono">{theme.spacing.lg}</span></div>
                <div>Extra Large: <span className="font-mono">{theme.spacing.xl}</span></div>
                <div>2XL: <span className="font-mono">{theme.spacing['2xl']}</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeExample;
