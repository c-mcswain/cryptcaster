/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
			display: ['Inter', 'system-ui', 'sans-serif'],
  			mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
        creepy: ['Creepster', 'system-ui'],
        pixel: ['VT323', 'monospace']
  		},
  		colors: {
        'crypt-purple': '#2D004D',
        'slime-green': '#39FF14',
        'hot-pink': '#FF007F',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			ring: 'hsl(var(--ring))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  		},
  		boxShadow: {
  			retro: '4px 4px 0px 0px rgba(57, 255, 20, 1)',
        'retro-pink': '4px 4px 0px 0px rgba(255, 0, 127, 1)',
        'retro-lg': '8px 8px 0px 0px rgba(57, 255, 20, 1)',
  		},
  		keyframes: {
  			'blink': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0' }
  			}
  		},
  		animation: {
  			'blink': 'blink 1s step-end infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")]
}