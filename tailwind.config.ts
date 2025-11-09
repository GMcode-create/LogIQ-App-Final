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
				// LogiQ specific colors
				'logiq': {
					'navy': '#1a1b3a',
					'navy-light': '#2a2d4a',
					'navy-dark': '#0f1020',
					'cyan': '#00bcd4',
					'cyan-light': '#4dd0e1',
					'cyan-dark': '#0097a7',
					'magenta': '#e91e63',
					'magenta-light': '#f06292',
					'magenta-dark': '#c2185b',
					'yellow': '#ffc107',
					'yellow-light': '#ffecb3',
					'yellow-dark': '#ff8f00',
					'purple': '#9c27b0',
					'purple-light': '#ba68c8',
					'purple-dark': '#7b1fa2',
					'text-primary': '#ffffff',
					'text-secondary': '#b0b3c1',
					'text-muted': '#8a8d9a',
				},
				'highlight-cyan': 'hsl(var(--highlight-cyan))',
				'highlight-magenta': 'hsl(var(--highlight-magenta))',
				'highlight-yellow': 'hsl(var(--highlight-yellow))'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['IBM Plex Mono', 'monospace'],
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-logiq-primary': 'linear-gradient(135deg, #00bcd4 0%, #9c27b0 100%)',
				'gradient-logiq-secondary': 'linear-gradient(135deg, #1a1b3a 0%, #2a2d4a 100%)',
				'gradient-logiq-hero': 'linear-gradient(135deg, #0f1020 0%, #1a1b3a 50%, #2a2d4a 100%)',
				'gradient-logiq-card': 'linear-gradient(135deg, #2a2d4a 0%, #1a1b3a 100%)',
				'gradient-logiq-cta': 'linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%)',
				'gradient-logiq-accent': 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)',
			},
			boxShadow: {
				glow: 'var(--shadow-glow)',
				card: 'var(--shadow-card)',
				'logiq-glow': '0 0 20px rgba(0, 188, 212, 0.3)',
				'logiq-glow-lg': '0 0 30px rgba(0, 188, 212, 0.4)',
				'logiq-card': '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
				'logiq-card-hover': '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 188, 212, 0.2)',
				'logiq-button': '0 4px 15px rgba(0, 188, 212, 0.3)',
				'logiq-button-hover': '0 6px 20px rgba(0, 188, 212, 0.4)',
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
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-down': {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-in-right': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'float-delayed': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-15px)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(0, 188, 212, 0.3)' },
					'50%': { boxShadow: '0 0 30px rgba(0, 188, 212, 0.6)' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'count-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in-down': 'fade-in-down 0.6s ease-out',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'float-delayed': 'float-delayed 4s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
				'count-up': 'count-up 0.8s ease-out'
			},
			// Enhanced accessibility utilities
			screens: {
				'reduce-motion': { 'raw': '(prefers-reduced-motion: reduce)' },
				'high-contrast': { 'raw': '(prefers-contrast: high)' },
				'reduce-transparency': { 'raw': '(prefers-reduced-transparency: reduce)' },
				'reduce-data': { 'raw': '(prefers-reduced-data: reduce)' },
			},
			// Performance optimization utilities
			willChange: {
				'transform-opacity': 'transform, opacity',
				'transform': 'transform',
				'opacity': 'opacity',
				'scroll': 'scroll-position',
				'contents': 'contents',
				'auto': 'auto',
			},
			contain: {
				'none': 'none',
				'strict': 'strict',
				'content': 'content',
				'size': 'size',
				'layout': 'layout',
				'style': 'style',
				'paint': 'paint',
				'size-layout': 'size layout',
				'size-style': 'size style',
				'size-paint': 'size paint',
				'layout-style': 'layout style',
				'layout-paint': 'layout paint',
				'style-paint': 'style paint',
				'layout-style-paint': 'layout style paint',
			},
			isolation: {
				'auto': 'auto',
				'isolate': 'isolate',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Custom plugin for accessibility and performance utilities
		function({ addUtilities, theme, addBase }: any) {
			// Add performance optimization utilities
			addUtilities({
				'.gpu-accelerate': {
					'transform': 'translate3d(0, 0, 0)',
					'backface-visibility': 'hidden',
					'perspective': '1000px',
				},
				'.will-change-transform-opacity': {
					'will-change': 'transform, opacity',
				},
				'.will-change-transform': {
					'will-change': 'transform',
				},
				'.will-change-opacity': {
					'will-change': 'opacity',
				},
				'.will-change-auto': {
					'will-change': 'auto',
				},
				'.contain-strict': {
					'contain': 'strict',
				},
				'.contain-layout-style-paint': {
					'contain': 'layout style paint',
				},
				'.isolate-layer': {
					'isolation': 'isolate',
				},
				// Accessibility utilities
				'.sr-only-focusable': {
					'position': 'absolute',
					'width': '1px',
					'height': '1px',
					'padding': '0',
					'margin': '-1px',
					'overflow': 'hidden',
					'clip': 'rect(0, 0, 0, 0)',
					'white-space': 'nowrap',
					'border': '0',
					'&:focus': {
						'position': 'static',
						'width': 'auto',
						'height': 'auto',
						'padding': 'inherit',
						'margin': 'inherit',
						'overflow': 'visible',
						'clip': 'auto',
						'white-space': 'normal',
					},
				},
				'.focus-visible-only': {
					'outline': 'none',
					'&:focus-visible': {
						'outline': '2px solid hsl(var(--primary))',
						'outline-offset': '2px',
					},
				},
				'.touch-target': {
					'min-height': '44px',
					'min-width': '44px',
				},
				'@media (pointer: coarse)': {
					'.touch-target-large': {
						'min-height': '48px',
						'min-width': '48px',
						'padding': '12px',
					},
				},
			});

			// Add reduced motion utilities
			addUtilities({
				'@media (prefers-reduced-motion: reduce)': {
					'.motion-reduce-disable': {
						'animation': 'none !important',
						'transition': 'none !important',
						'transform': 'none !important',
					},
					'.motion-reduce-short': {
						'animation-duration': '0.15s !important',
						'transition-duration': '0.15s !important',
					},
				},
				'@media (prefers-reduced-motion: no-preference)': {
					'.motion-safe-enable': {
						'animation': 'inherit',
						'transition': 'inherit',
						'transform': 'inherit',
					},
				},
			});

			// Add high contrast utilities
			addUtilities({
				'@media (prefers-contrast: high)': {
					'.high-contrast-border': {
						'border': '2px solid currentColor',
					},
					'.high-contrast-text': {
						'color': 'CanvasText',
						'background': 'Canvas',
					},
					'.high-contrast-button': {
						'border': '2px solid ButtonText',
						'color': 'ButtonText',
						'background': 'ButtonFace',
					},
				},
			});

			// Add base accessibility styles
			addBase({
				// Ensure focus is visible for keyboard users
				'*:focus-visible': {
					'outline': '2px solid hsl(var(--primary))',
					'outline-offset': '2px',
				},
				// Hide decorative elements from screen readers
				'[aria-hidden="true"]': {
					'display': 'none !important',
				},
				// Ensure interactive elements are properly sized
				'button, [role="button"], a, input[type="checkbox"], input[type="radio"]': {
					'min-height': '44px',
					'min-width': '44px',
				},
				// Improve readability
				'@media (prefers-reduced-motion: reduce)': {
					'*, *::before, *::after': {
						'animation-duration': '0.01ms !important',
						'animation-iteration-count': '1 !important',
						'transition-duration': '0.01ms !important',
						'scroll-behavior': 'auto !important',
					},
				},
			});
		},
	],
} satisfies Config;
