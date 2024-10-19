/** @type {import('tailwindcss').Config} */
import { withUt } from "uploadthing/tw";
export default withUt({
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			// center: 'true',
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				blue: {
					100: '#B4C6EE',
					400: '#417BFF',
					500: '#3371FF',
				},
				red: {
					400: '#DD4F56',
					500: '#DC4349',
				},
				dark: {
					100: '#09111F',
					200: '#0B1527',
					300: '#0F1C34',
					350: '#12213B',
					400: '#27344D',
					500: '#2E3D5B',
				},
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
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				doc: 'url(/assets/images/doc.png)',
				modal: 'url(/assets/images/modal.png)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
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
				ping: {
					'0%': { transform: 'scale(1)' },
					'25%': { transform: 'scale(1.5)' },
					'50%': { transform: 'scale(2)' }, // Grow slightly
					'75%': { transform: 'scale(1.5)' }, // Shrink slightly
					'100%': { transform: 'scale(1)' },  // Return to original size
				},
				// Hearts sprinkle out in different directions
				'heart-sprinkle-1': {
					'0%': {
						transform: 'translate(0, 0) scale(1)',
						opacity: '1',
					},
					'50%': {
						transform: 'translate(-20px, -30px) scale(1.2)',
						opacity: '0.8',
					},
					'100%': {
						transform: 'translate(-30px, -50px) scale(0.5)',
						opacity: '0',
					}
				},
				'heart-sprinkle-2': {
					'0%': {
						transform: 'translate(0, 0) scale(1)',
						opacity: '1',
					},
					'50%': {
						transform: 'translate(20px, -30px) scale(1.2)',
						opacity: '0.8',
					},
					'100%': {
						transform: 'translate(30px, -50px) scale(0.5)',
						opacity: '0',
					}
				},
				'heart-sprinkle-3': {
					'0%': {
						transform: 'translate(0, 0) scale(1)',
						opacity: '1',
					},
					'50%': {
						transform: 'translate(0px, -40px) scale(1.2)',
						opacity: '0.8',
					},
					'100%': {
						transform: 'translate(0px, -60px) scale(0.5)',
						opacity: '0',
					}
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'ping-once': 'ping 1.3s ease-in-out 1', // One-time ping animation
				'heart-sprinkle-1': 'heart-sprinkle-1 1s ease-out forwards',
				'heart-sprinkle-2': 'heart-sprinkle-2 1s ease-out forwards',
				'heart-sprinkle-3': 'heart-sprinkle-3 1s ease-out forwards',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
})