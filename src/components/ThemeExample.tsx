// ThemeExample.tsx
// This component demonstrates how to use the simple theme configuration

import React from 'react';
import { simpleTheme, lightenColor, darkenColor } from '@/lib/simpleTheme';

const ThemeExample = () => {
  return (
    <div style={{
      padding: simpleTheme.spacing.xl,
      fontFamily: simpleTheme.fonts.body,
      backgroundColor: simpleTheme.lightGray,
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: simpleTheme.white,
        borderRadius: simpleTheme.borderRadius.lg,
        boxShadow: simpleTheme.shadows.lg,
        padding: simpleTheme.spacing.xl
      }}>
        <h1 style={{
          color: simpleTheme.primary,
          fontSize: simpleTheme.fontSizes['4xl'],
          fontWeight: simpleTheme.fontWeights.bold,
          fontFamily: simpleTheme.fonts.headings,
          marginBottom: simpleTheme.spacing.lg,
          textAlign: 'center'
        }}>
          Theme Example
        </h1>
        
        <p style={{
          fontSize: simpleTheme.fontSizes.base,
          color: simpleTheme.darkGray,
          lineHeight: 1.6,
          marginBottom: simpleTheme.spacing.lg
        }}>
          This component demonstrates how to use the simple theme configuration. 
          You can easily customize colors, fonts, spacing, and other design elements 
          by modifying the values in <code>src/lib/simpleTheme.ts</code>.
        </p>
        
        {/* Color Palette Display */}
        <div style={{
          marginBottom: simpleTheme.spacing.xl
        }}>
          <h2 style={{
            color: simpleTheme.primary,
            fontSize: simpleTheme.fontSizes['2xl'],
            fontWeight: simpleTheme.fontWeights.semibold,
            marginBottom: simpleTheme.spacing.md,
            fontFamily: simpleTheme.fonts.headings
          }}>
            Color Palette
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: simpleTheme.spacing.md
          }}>
            <ColorCard 
              name="Primary" 
              color={simpleTheme.primary} 
              textColor={simpleTheme.white}
            />
            <ColorCard 
              name="Secondary" 
              color={simpleTheme.secondary} 
              textColor={simpleTheme.black}
            />
            <ColorCard 
              name="Success" 
              color={simpleTheme.success} 
              textColor={simpleTheme.white}
            />
            <ColorCard 
              name="Warning" 
              color={simpleTheme.warning} 
              textColor={simpleTheme.black}
            />
            <ColorCard 
              name="Error" 
              color={simpleTheme.error} 
              textColor={simpleTheme.white}
            />
            <ColorCard 
              name="Info" 
              color={simpleTheme.info} 
              textColor={simpleTheme.white}
            />
          </div>
        </div>
        
        {/* Typography Example */}
        <div style={{
          marginBottom: simpleTheme.spacing.xl
        }}>
          <h2 style={{
            color: simpleTheme.primary,
            fontSize: simpleTheme.fontSizes['2xl'],
            fontWeight: simpleTheme.fontWeights.semibold,
            marginBottom: simpleTheme.spacing.md,
            fontFamily: simpleTheme.fonts.headings
          }}>
            Typography
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: simpleTheme.spacing.sm
          }}>
            <TypographyExample 
              text="Heading 1" 
              size={simpleTheme.fontSizes['4xl']} 
              weight={simpleTheme.fontWeights.bold}
              font={simpleTheme.fonts.headings}
            />
            <TypographyExample 
              text="Heading 2" 
              size={simpleTheme.fontSizes['3xl']} 
              weight={simpleTheme.fontWeights.semibold}
              font={simpleTheme.fonts.headings}
            />
            <TypographyExample 
              text="Heading 3" 
              size={simpleTheme.fontSizes['2xl']} 
              weight={simpleTheme.fontWeights.medium}
              font={simpleTheme.fonts.headings}
            />
            <TypographyExample 
              text="Body Text" 
              size={simpleTheme.fontSizes.base} 
              weight={simpleTheme.fontWeights.normal}
              font={simpleTheme.fonts.body}
            />
            <TypographyExample 
              text="Small Text" 
              size={simpleTheme.fontSizes.sm} 
              weight={simpleTheme.fontWeights.normal}
              font={simpleTheme.fonts.body}
            />
          </div>
        </div>
        
        {/* Buttons Example */}
        <div>
          <h2 style={{
            color: simpleTheme.primary,
            fontSize: simpleTheme.fontSizes['2xl'],
            fontWeight: simpleTheme.fontWeights.semibold,
            marginBottom: simpleTheme.spacing.md,
            fontFamily: simpleTheme.fonts.headings
          }}>
            Buttons
          </h2>
          
          <div style={{
            display: 'flex',
            gap: simpleTheme.spacing.md,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <ThemeButton 
              text="Primary" 
              backgroundColor={simpleTheme.primary}
              textColor={simpleTheme.white}
            />
            <ThemeButton 
              text="Secondary" 
              backgroundColor={simpleTheme.secondary}
              textColor={simpleTheme.black}
            />
            <ThemeButton 
              text="Success" 
              backgroundColor={simpleTheme.success}
              textColor={simpleTheme.white}
            />
            <ThemeButton 
              text="Outline" 
              backgroundColor="transparent"
              borderColor={simpleTheme.primary}
              textColor={simpleTheme.primary}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Color Card Component
const ColorCard = ({ name, color, textColor }: { name: string; color: string; textColor: string }) => (
  <div style={{
    borderRadius: simpleTheme.borderRadius.md,
    overflow: 'hidden',
    boxShadow: simpleTheme.shadows.sm
  }}>
    <div style={{
      height: '100px',
      backgroundColor: color
    }} />
    <div style={{
      padding: simpleTheme.spacing.sm,
      backgroundColor: simpleTheme.white
    }}>
      <div style={{
        fontWeight: simpleTheme.fontWeights.semibold,
        color: simpleTheme.darkGray,
        fontSize: simpleTheme.fontSizes.sm
      }}>
        {name}
      </div>
      <div style={{
        fontSize: simpleTheme.fontSizes.xs,
        color: simpleTheme.gray
      }}>
        {color}
      </div>
    </div>
  </div>
);

// Typography Example Component
const TypographyExample = ({ text, size, weight, font }: { text: string; size: string; weight: number; font: string }) => (
  <div style={{
    fontSize: size,
    fontWeight: weight,
    fontFamily: font,
    color: simpleTheme.darkGray
  }}>
    {text}
  </div>
);

// Theme Button Component
const ThemeButton = ({ 
  text, 
  backgroundColor, 
  textColor,
  borderColor
}: { 
  text: string; 
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
}) => {
  const isOutline = backgroundColor === 'transparent';
  
  return (
    <button
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
        border: isOutline ? `2px solid ${borderColor || textColor}` : 'none',
        padding: `${simpleTheme.spacing.sm} ${simpleTheme.spacing.lg}`,
        borderRadius: simpleTheme.borderRadius.sm,
        fontSize: simpleTheme.fontSizes.base,
        fontWeight: simpleTheme.fontWeights.medium,
        cursor: 'pointer',
        fontFamily: simpleTheme.fonts.body,
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (!isOutline) {
          e.currentTarget.style.backgroundColor = darkenColor(backgroundColor, 10);
        } else {
          e.currentTarget.style.backgroundColor = borderColor || textColor;
          e.currentTarget.style.color = simpleTheme.white;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = backgroundColor;
        if (isOutline) {
          e.currentTarget.style.color = borderColor || textColor;
        }
      }}
    >
      {text}
    </button>
  );
};

export default ThemeExample;