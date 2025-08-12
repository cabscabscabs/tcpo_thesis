import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				ustp: {
					'dark-blue': 'hsl(var(--ustp-dark-blue))',
					'gold': 'hsl(var(--ustp-gold))',
					'light-blue': 'hsl(var(--ustp-light-blue))',
					'gray': 'hsl(var(--ustp-gray))',
					'bronze': 'hsl(var(--ustp-bronze))',
					'blue': 'hsl(var(--ustp-blue))',
					'orange': 'hsl(var(--ustp-orange))',
					'yellow': 'hsl(var(--ustp-yellow))'
				},
				// Theme system colors
				theme: {
					'primary-main': 'var(--color-primary-main)',
					'primary-light': 'var(--color-primary-light)',
					'primary-dark': 'var(--color-primary-dark)',
					'primary-contrast': 'var(--color-primary-contrast)',
					'secondary-main': 'var(--color-secondary-main)',
					'secondary-light': 'var(--color-secondary-light)',
					'secondary-dark': 'var(--color-secondary-dark)',
					'secondary-contrast': 'var(--color-secondary-contrast)',
					'accent-main': 'var(--color-accent-main)',
					'accent-light': 'var(--color-accent-light)',
					'accent-dark': 'var(--color-accent-dark)',
					'accent-contrast': 'var(--color-accent-contrast)',
					'neutral-white': 'var(--color-neutral-white)',
					'neutral-light': 'var(--color-neutral-light)',
					'neutral-gray': 'var(--color-neutral-gray)',
					'neutral-dark': 'var(--color-neutral-dark)',
					'success': 'var(--color-success)',
					'warning': 'var(--color-warning)',
					'error': 'var(--color-error)',
					'info': 'var(--color-info)',
				}
			},
			fontFamily: {
				'roboto': ['Roboto', 'sans-serif'],
				'open-sans': ['Open Sans', 'sans-serif']
			},
			backgroundImage: {
				'gradient-ustp': 'var(--gradient-ustp)',
				'gradient-gold': 'var(--gradient-gold)',
				'gradient-navy': 'var(--gradient-navy)',
				'gradient-primary': 'linear-gradient(135deg, var(--color-primary-main), var(--color-primary-light))',
				'gradient-secondary': 'linear-gradient(135deg, var(--color-secondary-main), var(--color-secondary-light))',
				'gradient-accent': 'linear-gradient(135deg, var(--color-accent-main), var(--color-accent-light))',
			},
			boxShadow: {
				'card': 'var(--shadow-card)',
				'gold': 'var(--shadow-gold)',
				'bronze': 'var(--shadow-bronze)',
				'theme-primary': 'var(--shadow-primary)',
				'theme-secondary': 'var(--shadow-secondary)',
				'theme-accent': 'var(--shadow-accent)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
