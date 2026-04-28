/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
			display: ['Cinzel', 'serif'],
  			mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
        creepy: ['Almendra', 'serif'],
        pixel: ['VT323', 'monospace'],
        gothic: ['Cinzel', 'serif']
  		},
  		colors: {
        'blood-red': '#3D0303',
        'nocturnal-purple': '#0D001A',
        'crypt-purple': '#120021',
        'slime-green': '#28A745',
        'lichen-green': '#4A5D4E',
        'phantom-pink': '#B31B4D',
        'noir-gray': '#1A1A1A',
        'hot-pink': '#B31B4D',
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
  			retro: '2px 2px 0px 0px rgba(40, 167, 69, 0.5)',
        'retro-pink': '2px 2px 0px 0px rgba(179, 27, 77, 0.5)',
        'retro-lg': '4px 4px 0px 0px rgba(40, 167, 69, 0.4)',
  		},
  		keyframes: {
  			'blink': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0' }
  			},
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 3px rgba(40, 167, 69, 0.3))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 10px rgba(40, 167, 69, 0.15))' }
        },
        'mist-flow': {
          '0%': { transform: 'translateX(-5%)' },
          '100%': { transform: 'translateX(5%)' }
        }
  		},
  		animation: {
  			'blink': 'blink 2s step-end infinite',
        'pulse-glow': 'pulse-glow 6s ease-in-out infinite',
        'mist': 'mist-flow 30s ease-in-out infinite alternate',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")]
}